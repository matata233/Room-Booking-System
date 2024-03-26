import AbstractRepository from "./AbstractRepository";
import BookingDTO from "../model/dto/BookingDTO";
import AggregateAttendeeDTO from "../model/dto/AggregateAttendeeDTO";
import {PrismaClient} from "@prisma/client";
import {
    BadRequestError,
    NotFoundError,
    RequestConflictError,
    UnavailableAttendeesError
} from "../util/exception/AWSRoomBookingSystemError";
import {toAvailableRoomDTO, toBookingDTO} from "../util/Mapper/BookingMapper";

export default class BookingRepository extends AbstractRepository {
    constructor(database: PrismaClient) {
        super(database);
    }

    public async findAll(): Promise<BookingDTO[]> {
        const bookings = await this.db.bookings.findMany({
            include: {
                users: {
                    include: {
                        buildings: {
                            include: {
                                cities: true
                            }
                        }
                    }
                },
                users_bookings: {
                    include: {
                        users: true,
                        rooms: {
                            include: {
                                buildings: {
                                    include: {
                                        cities: true
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });

        return bookings.map((booking) => {
            return toBookingDTO(booking, booking.users, booking.users_bookings);
        });
    }

    public async findById(id: number): Promise<BookingDTO> {
        const booking = await this.db.bookings.findUnique({
            where: {
                booking_id: id
            },
            include: {
                users: {
                    include: {
                        buildings: {
                            include: {
                                cities: true
                            }
                        }
                    }
                },
                users_bookings: {
                    include: {
                        users: true,
                        rooms: {
                            include: {
                                buildings: {
                                    include: {
                                        cities: true
                                    }
                                }
                            }
                        }
                    }
                }
            }
        });

        if (!booking) {
            return Promise.reject(new NotFoundError(`Booking not found with id: ${id}`));
        }

        return toBookingDTO(booking, booking.users, booking.users_bookings);
    }

    public async findByUserId(id: number): Promise<BookingDTO[]> {
        const bookings = await this.db.bookings.findMany({
            where: {
                users_bookings: {
                    some: {
                        user_id: id
                    }
                }
            },
            include: {
                users: true,
                users_bookings: {
                    include: {
                        users: true,
                        rooms: {
                            include: {
                                buildings: {
                                    include: {
                                        cities: true
                                    }
                                },
                                rooms_equipments: {
                                    include: {
                                        equipments: true
                                    }
                                }
                            }
                        }
                    }
                }
            },
            orderBy: {
                created_at: "desc"
            }
        });

        return bookings.map((booking) => toBookingDTO(booking, booking.users, booking.users_bookings));
    }

    public async create(
        createdBy: number,
        createdAt: string,
        startTime: string,
        endTime: string,
        rooms: string[],
        attendees: number[][]
    ): Promise<BookingDTO> {
        const newBooking = await this.db.$transaction(async (tx) => {
            // TODO: check for attendee availability again
            // TODO: cannot identify which room is not available, start from rooms_bookings table
            // check if the room is available
            const conflictBooking = await tx.bookings.findFirst({
                where: {
                    AND: [
                        {start_time: {lt: endTime}},
                        {end_time: {gt: startTime}},
                        {status: {not: "canceled"}},
                        {
                            users_bookings: {
                                some: {
                                    room_id: {
                                        in: rooms.map((room) => parseInt(room))
                                    }
                                }
                            }
                        }
                    ]
                }
            });

            if (conflictBooking !== null) {
                // TODO: can add to error message to indicate which rooms are unavailable
                throw new RequestConflictError("Room is unavailable in this timeslot");
            }
            const booking = await tx.bookings.create({
                data: {
                    created_by: createdBy,
                    created_at: createdAt,
                    start_time: startTime,
                    end_time: endTime,
                    status: "confirmed"
                }
            });

            // for each group of attendees, create a user_booking entry
            for (let i = 0; i < attendees.length; i++) {
                const group = attendees[i];
                const roomId = parseInt(rooms[i]);

                // eslint-disable-next-line no-await-in-loop
                await Promise.all(
                    group.map((userId) => {
                        return tx.users_bookings.create({
                            data: {
                                booking_id: booking.booking_id,
                                user_id: userId,
                                room_id: roomId
                            }
                        });
                    })
                );
            }

            return tx.bookings.findUnique({
                where: {booking_id: booking.booking_id},
                include: {
                    users: true,
                    users_bookings: {
                        include: {
                            users: true,
                            rooms: {
                                include: {
                                    buildings: {
                                        include: {
                                            cities: true
                                        }
                                    }
                                }
                            }
                        }
                    }
                }
            });
        });

        if (newBooking === null) {
            throw new Error();
        }

        return toBookingDTO(newBooking, newBooking.users, newBooking.users_bookings);
    }

    public async update(id: number, status: string, attendees: number[][], rooms: number[]): Promise<BookingDTO> {
        return await this.db.$transaction(async (tx) => {
            // TODO: check time

            const currentBooking = await tx.bookings.findUnique({
                where: {booking_id: id}
            });

            if (!currentBooking || currentBooking.status === "canceled") {
                throw new NotFoundError("booking does not exist or has been canceled");
            }

            if (status === "canceled") {
                await tx.bookings.update({
                    where: {
                        booking_id: id
                    },
                    data: {
                        status: status
                    }
                });
                return Promise.resolve({});
            }

            await this.checkAttendeeAvailabilitiesForUpdate(attendees, currentBooking);

            await tx.users_bookings.deleteMany({
                where: {
                    booking_id: id
                }
            });

            // for each group of attendees, create a user_booking entry
            const usersBookings = [];
            for (let i = 0; i < attendees.length; i++) {
                const userGroup = attendees[i];
                const roomId = rooms[i];

                const groupBookings = [];
                for (let j = 0; j < userGroup.length; j++) {
                    // eslint-disable-next-line no-await-in-loop
                    const result = await tx.users_bookings.create({
                        data: {
                            booking_id: id,
                            user_id: userGroup[j],
                            room_id: roomId
                        }
                    });
                    groupBookings.push(result);
                }
                usersBookings.push(groupBookings);
            }

            return Promise.resolve({});
        });
    }

    public async getAvailableRooms(
        startTime: string,
        endTime: string,
        attendees: string[][],
        equipments: string[],
        priority: string[],
        roomCount: number,
        regroup: boolean
    ): Promise<object> {
        const flatAttendees = attendees.flat();
        await this.checkAttendeeAvailabilities(flatAttendees, startTime, endTime);
        const attendeeCityIds = await Promise.all(flatAttendees.map((attendee) => this.getCityId(attendee)));
        const uniqueCityIds = new Set(attendeeCityIds);
        const isMultiCity = uniqueCityIds.size > 1;
        let attendeeGroups: string[][];
        if (isMultiCity) {
            attendeeGroups = [...uniqueCityIds].map((cityId) =>
                flatAttendees.filter((_, i) => attendeeCityIds[i] === cityId)
            );
        } else {
            if (!regroup && roomCount !== attendees.length) {
                throw new BadRequestError(
                    "please turn on auto-regroup after changing the number of rooms or switching between one or multiple cities"
                );
            }
            attendeeGroups = regroup ? await this.getGroupingSuggestion(flatAttendees, roomCount) : attendees;
        }
        const roomSearchResults = await Promise.all(
            attendeeGroups.map((group) => this.searchForRooms(group, startTime, endTime, equipments, priority))
        );
        return {isMultiCity: isMultiCity, groups: roomSearchResults};
    }

    public async getSuggestedTimes(
        startTime: string,
        endTime: string,
        duration: string,
        attendees: string[],
        equipments: string[],
        stepSize: string = "15 minutes"
    ): Promise<object[]> {
        if (attendees.length <= 0) {
            return Promise.reject(new BadRequestError("No attendees inputted"));
        }
        const city = await this.getCityId(attendees[0]);
        const query = this.buildTimeSuggestionQuery(
            startTime,
            endTime,
            duration,
            attendees,
            equipments,
            stepSize,
            city
        );
        return await this.db.$queryRawUnsafe(query);
    }

    // TODO: refactor this
    private async checkAttendeeAvailabilitiesForUpdate(attendees: number[][], currentBooking: any) {
        const unavailableAttendees = await this.db.users.findMany({
            where: {
                user_id: {
                    in: attendees.flat()
                },
                OR: [
                    {
                        users_bookings: {
                            some: {
                                bookings: {
                                    AND: [
                                        {start_time: {lt: currentBooking.end_time}},
                                        {end_time: {gt: currentBooking.end_time}},
                                        {status: {not: "canceled"}},
                                        {booking_id: {not: currentBooking.booking_id}}
                                    ]
                                }
                            }
                        }
                    },
                    {
                        events: {
                            some: {
                                AND: [
                                    {start_time: {lt: currentBooking!.end_time}},
                                    {end_time: {gt: currentBooking!.start_time}}
                                ]
                            }
                        }
                    }
                ]
            },
            include: {
                users_bookings: true
            }
        });

        if (unavailableAttendees.length > 0) {
            throw new UnavailableAttendeesError(
                unavailableAttendees.map((user) => `${user.first_name} ${user.last_name} (${user.email})`).join(", ")
            );
        }
    }

    private async getGroupingSuggestion(attendees: string[], roomCount: number): Promise<string[][]> {
        if (roomCount === 1) {
            return [attendees];
        }
        if (roomCount > attendees.length) {
            throw new BadRequestError("Number of rooms greater than users");
        }
        const uniqueBuildings = await this.getBuildingFloor(attendees);
        if (roomCount > uniqueBuildings.length) {
            throw new BadRequestError("Number of rooms greater than number of different buildings in groups");
        }
        const remainingBuildings = uniqueBuildings.map((entry) => Number(entry.building_id));
        while (uniqueBuildings.length > roomCount) {
            const toRemove = uniqueBuildings.pop();
            remainingBuildings.splice(remainingBuildings.indexOf(Number(toRemove!.building_id)), 1);
            for (const buildingId of toRemove!.closest_buildings!) {
                if (!remainingBuildings.includes(buildingId)) {
                    continue;
                }
                const i = this.customIndexOf(uniqueBuildings, (entry_1) => Number(entry_1.building_id) === buildingId);
                if (i === -1) {
                    continue;
                }
                // @ts-expect-error temp
                // eslint-disable-next-line no-unsafe-optional-chaining
                uniqueBuildings[i].users!.push(...toRemove?.users);
                // @ts-expect-error temp
                uniqueBuildings[i].num_users! += toRemove?.num_users;
                uniqueBuildings.sort((a, b) => Number(b.num_users! - a.num_users!));
                break;
            }
        }
        const res = [];
        for (const entry2 of uniqueBuildings) {
            res.push(entry2.users!);
        }
        return res;
    }

    private async searchForRooms(
        attendeeGroup: string[],
        startTime: string,
        endTime: string,
        equipments: string[],
        priority: string[]
    ) {
        const city = await this.getCityId(attendeeGroup[0]);
        const buildingFloorList = await this.getBuildingFloor(attendeeGroup);
        const closestBuildingId = buildingFloorList[0].building_id;
        const floor = buildingFloorList[0].floor as number;
        const recommendedRooms = await this.db.$queryRawUnsafe(
            this.buildRoomSearchQuery(
                startTime,
                endTime,
                attendeeGroup,
                equipments,
                priority,
                closestBuildingId,
                city,
                floor
            )
        );
        const attendeeList = await this.db.users.findMany({
            where: {
                email: {
                    in: attendeeGroup
                }
            },
            select: {
                user_id: true,
                email: true,
                first_name: true,
                last_name: true
            }
        });
        return {
            attendees: attendeeList,
            rooms: toAvailableRoomDTO(recommendedRooms as never[], equipments)
        };
    }

    private async checkAttendeeAvailabilities(attendees: string[], startTime: string, endTime: string) {
        const unavailableAttendees = await this.db.users.findMany({
            where: {
                email: {
                    in: attendees
                },
                OR: [
                    {
                        users_bookings: {
                            some: {
                                bookings: {
                                    AND: [
                                        {start_time: {lt: endTime}},
                                        {end_time: {gt: startTime}},
                                        {status: {not: "canceled"}}
                                    ]
                                }
                            }
                        }
                    },
                    {
                        events: {
                            some: {
                                AND: [{start_time: {lt: endTime}}, {end_time: {gt: startTime}}]
                            }
                        }
                    }
                ]
            },
            include: {
                users_bookings: true
            }
        });
        if (unavailableAttendees.length > 0) {
            throw new UnavailableAttendeesError(
                unavailableAttendees.map((user) => `${user.first_name} ${user.last_name} (${user.email})`).join(", ")
            );
        }
    }

    private async getCityId(email: string): Promise<string> {
        const res = await this.db.users.findUnique({
            where: {
                email: email
            },
            include: {
                buildings: {
                    select: {
                        city_id: true
                    }
                }
            }
        });
        if (res === null) {
            throw new NotFoundError(`User ${email} not found`);
        }
        return res.buildings.city_id;
    }

    private async getBuildingFloor(attendees: string[]): Promise<AggregateAttendeeDTO[]> {
        const emails = "'".concat(attendees.join("', '")).concat("'");
        //@formatter:off
        const query = `
            WITH user_counts AS
                     (SELECT building_id,
                             COUNT(*) AS num_users,
                             ARRAY_AGG(email) AS users
                      FROM users
                      WHERE email IN (${emails})
                      GROUP BY building_id),
                 max_floor_per_building AS
                     (SELECT building_id,
                             floor
                      FROM
                          (SELECT building_id,
                                  floor,
                                  ROW_NUMBER() OVER (PARTITION BY building_id
                                      ORDER BY COUNT(*) DESC) AS rn
                           FROM users
                           WHERE email IN (${emails})
                           GROUP BY building_id,
                                    floor) t
                      WHERE rn = 1 ),
                 agg_users AS
                     (SELECT uc.building_id,
                             uc.num_users,
                             mfp.floor,
                             uc.users
                      FROM user_counts uc
                               JOIN max_floor_per_building mfp ON uc.building_id = mfp.building_id
                      ORDER BY num_users DESC),
                 agg_users_dist AS
                     (SELECT au.building_id,
                             au.num_users,
                             au.floor,
                             au.users,
                             d.building_id_to,
                             d.distance
                      FROM agg_users AS au
                               JOIN distances d ON au.building_id = d.building_id_from)
            SELECT agd.building_id,
                   agd.num_users,
                   agd.floor,
                   agd.users,
                   array_agg(agd.building_id_to
                             ORDER BY agd.distance) AS closest_buildings
            FROM agg_users_dist agd
            WHERE agd.building_id_to IN
                  (SELECT building_id
                   FROM user_counts)
            GROUP BY agd.building_id,
                     agd.num_users,
                     agd.floor,
                     agd.users
            ORDER BY num_users DESC,
                     CASE
                         WHEN agd.building_id =
                              (SELECT building_id
                               FROM users
                               WHERE email = '${attendees[0]}' ) THEN 0
                         ELSE 1
                         END
        `;
        //@formatter:on
        const ret = await this.db.$queryRawUnsafe(query);
        const res: AggregateAttendeeDTO[] = [];
        (ret as AggregateAttendeeDTO[]).forEach((entry) => {
            res.push(entry);
        });
        const sum = res.map((entry_1) => Number(entry_1.num_users)).reduce((a, b) => a + b);
        if (sum !== attendees.length) {
            return Promise.reject(new NotFoundError("Some users not found"));
        }
        return res;
    }

    private buildRoomSearchQuery(
        startTime: string,
        endTime: string,
        attendees: string[],
        equipments: string[],
        priorities: string[],
        closestBuildingId: string,
        city: string,
        floorFrom: number
    ): string {
        const orderBy: string[] = [];
        priorities.forEach((priority) => {
            if (priority === "distance") {
                orderBy.push(
                    `distance, CASE WHEN available_rooms.building_id = ${closestBuildingId} THEN ABS(available_rooms.floor - ${floorFrom}) END, floor`
                );
            } else if (priority === "equipments") {
                orderBy.push(
                    equipments.length ? equipments.map((eq) => `CASE WHEN has_${eq} THEN 0 ELSE 1 END`).join(",") : "1"
                );
            } else {
                orderBy.push("seats");
            }
        });
        //@formatter:off
        return `
            WITH room_equipment_info AS
                (SELECT room_id,
                        bool_or(equipment_id = 'AV') AS has_av,
                        bool_or(equipment_id = 'VC') AS has_vc
                 FROM rooms_equipments
                 GROUP BY room_id),
                 room_info AS
                (SELECT r.room_id,
                        r.building_id,
                        r.floor,
                        r.code AS room_code,
                        r.name AS room_name,
                        r.seats,
                        coalesce(rei.has_av, FALSE) AS has_av,
                        coalesce(rei.has_vc, FALSE) AS has_vc,
                        bool_or(r.seats >= ${attendees.length}) AS is_big_enough,
                        coalesce(d.distance, 1000000) AS distance
                 FROM rooms r
                 LEFT JOIN room_equipment_info rei ON r.room_id = rei.room_id
                 LEFT JOIN distances d ON r.building_id = d.building_id_to
                 AND d.building_id_from = ${closestBuildingId}
                 WHERE r.is_active = TRUE
                 GROUP BY r.room_id,
                          r.building_id,
                          r.floor,
                          r.code,
                          r.name,
                          r.seats,
                          rei.has_av,
                          rei.has_vc,
                          d.distance),
                 available_rooms AS
                (SELECT ri.*
                 FROM room_info ri
                 JOIN buildings b ON ri.building_id = b.building_id
                 WHERE b.city_id = '${city}'
                     AND b.is_active = TRUE
                     AND ri.room_id NOT IN
                         (SELECT ub.room_id
                          FROM users_bookings ub
                          JOIN bookings b ON b.booking_id = ub.booking_id
                          WHERE b.start_time < '${endTime}'
                              AND b.end_time > '${startTime}'
                              AND b.status != 'canceled' ) )
            SELECT buildings.city_id,
                   buildings.code AS building_code,
                   available_rooms.floor,
                   available_rooms.room_code AS room_code,
                   available_rooms.room_name AS room_name,
                   available_rooms.room_id,
                   available_rooms.distance,
                   available_rooms.seats,
                   available_rooms.has_av,
                   available_rooms.has_vc,
                   available_rooms.is_big_enough
            FROM available_rooms,
                 buildings
            WHERE available_rooms.building_id = buildings.building_id
            ORDER BY ${orderBy[0]}, ${orderBy[1]}, ${orderBy[2]}
        `;
        //@formatter:on
    }

    private buildTimeSuggestionQuery(
        startTime: string,
        endTime: string,
        duration: string,
        attendees: string[],
        equipments: string[],
        stepSize: string,
        city: string
    ): string {
        let userList = `(`;
        for (let i = 0; i < attendees.length; i++) {
            userList += `'${attendees[i]}'`;
            if (i !== attendees.length - 1) {
                userList += ",";
            }
        }
        userList += `)`;
        //@formatter:off
        let query = `
            WITH RECURSIVE dates AS (
              SELECT TIMESTAMP '${startTime}' AS dt 
              UNION ALL
              SELECT dt + INTERVAL '${stepSize}'
              FROM dates 
              WHERE dt + INTERVAL '${stepSize}' < TIMESTAMP '${endTime}'
            ), 
            room_availability AS (
              SELECT 
                DISTINCT r.room_id, 
                b2.start_time, 
                b2.end_time 
              FROM 
                rooms r 
                LEFT JOIN buildings b ON r.building_id = b.building_id 
                LEFT JOIN users_bookings ub ON r.room_id = ub.room_id 
                LEFT JOIN bookings b2 ON ub.booking_id = b2.booking_id 
              WHERE 
                b.city_id = '${city}' AND (b2.start_time < '${endTime}' OR b2.end_time > '${startTime}')
            ), 
            user_ids AS (
              SELECT u.user_id 
              FROM users u 
              WHERE u.email IN ${userList}
            ), 
            user_bookings_overlap AS (
              SELECT 
                ub.user_id, 
                b.start_time, 
                b.end_time 
              FROM 
                users_bookings ub 
                JOIN bookings b ON ub.booking_id = b.booking_id 
              WHERE 
                b.start_time < '${endTime}' AND b.end_time > '${startTime}' AND ub.user_id IN (SELECT user_id FROM user_ids)
            ), 
            room_equipment_info AS (
              SELECT 
                room_id
        `;
        //@formatter:on
        equipments.forEach((eq) => {
            const toAdd = `,\n            bool_or(equipment_id='${eq}') AS has_${eq}`;
            query += toAdd;
        });

        query += `
            FROM rooms_equipments
            GROUP by room_id
        ),
        room_equip AS (
            SELECT r.room_id`;

        if (equipments.length > 0) {
            for (const eq of equipments) {
                query += `,
            COALESCE( re.has_${eq}, FALSE ) as has_${eq}`;
            }
        }

        query += `
            FROM rooms r
            LEFT JOIN room_equipment_info re ON r.room_id = re.room_id`;

        if (equipments.length > 0) {
            query += `
            WHERE re.has_${equipments[0]}
                  AND r.seats >= ${attendees.length}`;

            for (let i = 0; i < equipments.length; i++) {
                query += ` AND re.has_${equipments[i]}`;
            }
        }

        query += `
        )
        SELECT d.dt AS start_time, d.dt + INTERVAL '${duration}' AS end_time
        FROM dates d
        WHERE EXISTS(
            SELECT 1 FROM room_equip r WHERE r.room_id NOT IN (
                SELECT ra.room_id FROM room_availability ra WHERE
                (d.dt, d.dt + INTERVAL '${duration}') OVERLAPS (ra.start_time, ra.end_time)
            )
            LIMIT 1
        )
        AND NOT EXISTS (
            SELECT 1 FROM user_bookings_overlap AS ub
            WHERE ( d.dt, d.dt + INTERVAL '${duration}' ) OVERLAPS (ub.start_time, ub.end_time)
            LIMIT 1
        )`;
        return query;
    }

    private customIndexOf<T>(arr: T[], testF: (t: T) => boolean) {
        for (let i = 0; i < arr.length; i++) {
            if (testF(arr[i])) {
                return i;
            }
        }
        return -1;
    }
}
