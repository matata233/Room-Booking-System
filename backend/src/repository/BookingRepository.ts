import AbstractRepository from "./AbstractRepository";
import BookingDTO from "../model/dto/BookingDTO";
import AggregateAttendeeDTO from "../model/dto/AggregateAttendeeDTO";
import {PrismaClient, users} from "@prisma/client";
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
            }
        });

        return bookings.map((booking) => toBookingDTO(booking, booking.users, booking.users_bookings));
    }

    public async create(
        created_by: number,
        created_at: string,
        start_time: string,
        end_time: string,
        rooms: string[],
        attendees: number[][]
    ): Promise<BookingDTO> {
        const newBooking = await this.db.$transaction(async (tx) => {
            // TODO: cannot identify which room is not available, start from rooms_bookings table
            const conflictBooking = await tx.bookings.findFirst({
                where: {
                    AND: [
                        {start_time: {lt: end_time}},
                        {end_time: {gt: start_time}},
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
                    created_by: created_by,
                    created_at: created_at,
                    start_time: start_time,
                    end_time: end_time,
                    status: "confirmed"
                }
            });

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

    public async getGroupingSuggestion(attendees: string[], num_rooms: number): Promise<string[][]> {
        if (num_rooms > attendees.length) {
            throw new BadRequestError("Number of rooms greater than users");
        }
        const ret = await this.getBuildingFloor(attendees);
        if (num_rooms > ret.length) {
            throw new BadRequestError("Number of rooms greater than number of different buildings in groups");
        }
        const remaining_buildings = ret.map((entry) => Number(entry.building_id));
        while (ret.length > num_rooms) {
            const to_remove = ret.pop();
            remaining_buildings.splice(remaining_buildings.indexOf(Number(to_remove!.building_id)), 1);
            for (const building_id of to_remove!.closest_buildings!) {
                if (!remaining_buildings.includes(building_id)) {
                    continue;
                }
                const i = this.customIndexOf(ret, (entry_1) => Number(entry_1.building_id) === building_id);
                if (i === -1) {
                    continue;
                }
                // @ts-expect-error temp
                // eslint-disable-next-line no-unsafe-optional-chaining
                ret[i].users!.push(...to_remove?.users);
                // @ts-expect-error temp
                ret[i].num_users! += to_remove?.num_users;
                ret.sort((a, b) => Number(b.num_users! - a.num_users!));
                break;
            }
        }
        const res = [];
        for (const entry_2 of ret) {
            res.push(entry_2.users!);
        }
        return res;
    }

    public async getSuggestedTimes(
        start_time: string,
        end_time: string,
        duration: string,
        attendees: string[],
        equipments: string[],
        step_size: string = "15 minutes"
    ): Promise<object[]> {
        if (attendees.length <= 0) {
            return Promise.reject(new BadRequestError("No attendees inputted"));
        }
        const city_code = await this.getCityId(attendees[0]);
        const query = this.buildTimeSuggestionQuery(
            start_time,
            end_time,
            duration,
            attendees,
            equipments,
            step_size,
            city_code
        );
        return await this.db.$queryRawUnsafe(query);
    }

    public async getAvailableRooms(
        start_time: string,
        end_time: string,
        attendees: string[],
        equipments: string[],
        priority: string[],
        num_rooms: number
    ): Promise<object> {
        return this.getUnavailableAttendees(attendees, start_time, end_time)
            .then((unavailableAttendees) => {
                if (unavailableAttendees.length > 0) {
                    throw new UnavailableAttendeesError(
                        unavailableAttendees
                            .map((user) => {
                                return user.email + ",";
                            })
                            .toString()
                            .slice(0, -1)
                    );
                }
                // Select the current user's city as the city for the booking
                return this.getCityId(attendees[0]);
            })
            .then(async (city) => {
                const groupedAttendees = await this.getGroupingSuggestion(attendees, num_rooms);
                const roomAllocationPromises = groupedAttendees.map(async (attendeeGroup) => {
                    const buildingFloorList = await this.getBuildingFloor(attendeeGroup);
                    const closest_building_id = buildingFloorList[0].building_id;
                    const floor = buildingFloorList[0].floor as number;
                    const recommendedRooms = await this.db.$queryRawUnsafe(
                        this.buildRoomSearchQuery(
                            start_time,
                            end_time,
                            attendeeGroup,
                            equipments,
                            priority,
                            closest_building_id,
                            city,
                            floor
                        )
                    );
                    return {
                        attendees: attendeeGroup,
                        rooms: toAvailableRoomDTO(recommendedRooms as never[], equipments)
                    };
                });
                return await Promise.all(roomAllocationPromises);
            })
            .then((groups) => {
                return {groups: groups};
            });
    }

    private getUnavailableAttendees(attendees: string[], start_time: string, end_time: string): Promise<users[]> {
        return this.db.users.findMany({
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
                                        {start_time: {lt: end_time}},
                                        {end_time: {gt: start_time}},
                                        {status: {not: "canceled"}}
                                    ]
                                }
                            }
                        }
                    },
                    {
                        events: {
                            some: {
                                AND: [{start_time: {lt: end_time}}, {end_time: {gt: start_time}}]
                            }
                        }
                    }
                ]
            }
        });
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
        let emails = "";
        for (let i = 0; i < attendees.length; i++) {
            emails += `'${attendees[i]}',`;
        }
        emails = emails.slice(0, -1);
        const query = `
            WITH user_counts AS (SELECT building_id, COUNT(*) AS num_users, ARRAY_AGG(email) AS users
                                 FROM users
                                 WHERE email IN (${emails})
                                 GROUP BY building_id),
                 max_floor_per_building AS (SELECT building_id, floor
                                            FROM (SELECT building_id,
                                                         floor,
                                                         ROW_NUMBER() OVER (PARTITION BY building_id ORDER BY COUNT(*) DESC) AS rn
                                                  FROM users
                                                  WHERE email IN (${emails})
                                                  GROUP BY building_id, floor) t
                                            WHERE rn = 1),
                 agg_users AS (SELECT uc.building_id, uc.num_users, mfp.floor, uc.users
                               FROM user_counts uc
                                        JOIN max_floor_per_building mfp ON uc.building_id = mfp.building_id
                               ORDER BY num_users DESC),
                 agg_users_dist AS (SELECT au.building_id,
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
                   array_agg(agd.building_id_to ORDER BY agd.distance) AS closest_buildings
            FROM agg_users_dist agd
            WHERE agd.building_id_to IN (SELECT building_id FROM user_counts)
            GROUP BY agd.building_id, agd.num_users, agd.floor, agd.users`;

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
        start_time: string,
        end_time: string,
        attendees: string[],
        equipments: string[],
        priorities: string[],
        closest_building_id: string,
        city_id: string,
        floor_from: number
    ): string {
        priorities.forEach((val, i, arr) => {
            if (val === "distance") {
                arr[i] =
                    `${val}, CASE WHEN available_rooms.building_id = ${closest_building_id} THEN ABS(floor - ${floor_from}) ELSE 10000 END`;
            } else if (val === "equipments") {
                if (equipments.length === 0) {
                    arr[i] = "1";
                    return;
                }
                arr[i] = "";
                equipments.forEach((eq) => {
                    arr[i] += `CASE WHEN has_${eq} THEN 0 ELSE 1 END,`;
                });
                arr[i] = arr[i].slice(0, -1);
            }
        });
        return `WITH room_equipment_info AS (SELECT room_id,
                                                    bool_or(equipment_id = 'AV') AS has_av,
                                                    bool_or(equipment_id = 'VC') AS has_vc
                                             FROM rooms_equipments
                                             GROUP BY room_id),
                     room_info AS (SELECT r.room_id,
                                          r.building_id,
                                          r.floor,
                                          r.code                                  as room_code,
                                          r.name                                  as room_name,
                                          r.seats,
                                          COALESCE(rei.has_av, FALSE)             AS has_av,
                                          COALESCE(rei.has_vc, FALSE)             AS has_vc,
                                          bool_or(r.seats >= ${attendees.length}) AS is_big_enough,
                                          CASE
                                              WHEN r.building_id = ${closest_building_id} THEN 0
                                              ELSE COALESCE(d.distance, 10000)
                                              END                                 AS distance
                                   FROM rooms r
                                            LEFT JOIN room_equipment_info rei ON r.room_id = rei.room_id
                                            LEFT JOIN distances d ON (r.building_id = d.building_id_to AND
                                                                      d.building_id_from =
                                                                      ${closest_building_id})
                                       OR (r.building_id = d.building_id_from AND
                                           d.building_id_to = ${closest_building_id})
                                   WHERE r.is_active = TRUE
                                   GROUP BY r.room_id, r.building_id, r.floor, r.code, r.name, r.seats,
                                            rei.has_av, rei.has_vc, d.distance),
                     available_rooms AS (SELECT ri.*
                                         FROM room_info ri
                                                  JOIN buildings b ON ri.building_id = b.building_id
                                         WHERE b.city_id = '${city_id}'
                                           AND b.is_active = TRUE
                                           AND ri.room_id NOT IN (SELECT ub.room_id
                                                                  FROM users_bookings ub
                                                                           JOIN bookings b ON b.booking_id = ub.booking_id
                                                                  WHERE (b.start_time < '${end_time}' AND b.end_time > '${start_time}')
                                                                    AND b.status != 'canceled'))
                SELECT buildings.city_id,
                       buildings.code            as building_code,
                       available_rooms.floor,
                       available_rooms.room_code as room_code,
                       available_rooms.room_name as room_name,
                       available_rooms.room_id,
                       available_rooms.distance,
                       available_rooms.seats,
                       available_rooms.has_av,
                       available_rooms.has_vc,
                       available_rooms.is_big_enough
                FROM available_rooms,
                     buildings
                WHERE available_rooms.building_id = buildings.building_id
                ORDER BY ${priorities[0]}, ${priorities[1]}, ${priorities[2]}`;
    }

    private buildTimeSuggestionQuery(
        start_time: string,
        end_time: string,
        duration: string,
        attendees: string[],
        equipments: string[],
        step_size: string,
        city_code: string
    ): string {
        let userList = `(`;
        for (let i = 0; i < attendees.length; i++) {
            userList = userList + `'${attendees[i]}'`;
            if (i !== attendees.length - 1) {
                userList = userList + ",";
            }
        }
        userList = userList + `)`;
        let query = `
            WITH RECURSIVE dates AS (SELECT TIMESTAMP '${start_time}' AS dt
                                     UNION ALL
                                     SELECT dt + INTERVAL '${step_size}'
                                     FROM dates
                                     WHERE dt + INTERVAL '${step_size}'
                                               < TIMESTAMP '${end_time}')
               , room_availability AS (SELECT DISTINCT r.room_id, b2.start_time, b2.end_time
                                       FROM rooms r
                                                LEFT JOIN buildings b
                                                          ON r.building_id = b.building_id
                                                LEFT JOIN bookings_rooms br ON r.room_id = br.room_id
                                                LEFT JOIN bookings b2 ON br.booking_id = b2.booking_id
                                       WHERE b.city_id = '${city_code}'
                                         AND (b2.start_time
                                                  < '${end_time}'
                                           OR b2.end_time
                                                  > '${start_time}'))
               , user_ids AS (SELECT u.user_id
                              FROM users u
                              WHERE u.email IN ${userList})
               , user_bookings_overlap AS (SELECT ub.user_id, b.start_time, b.end_time
                                           FROM users_bookings ub
                                                    JOIN bookings b
                                                         ON ub.booking_id = b.booking_id
                                           WHERE b.start_time
                                               < '${end_time}'
                                             AND b.end_time
                                               > '${start_time}'
                                             AND ub.user_id IN (SELECT user_id from user_ids))
               , room_equipment_info AS (SELECT room_id`;

        equipments.forEach((eq) => {
            const toAdd = `,\n            bool_or(equipment_id='${eq}') AS has_${eq}`;
            query = query + toAdd;
        });

        query =
            query +
            `
            FROM rooms_equipments
            GROUP by room_id
        ),
        room_equip AS (
            SELECT r.room_id`;

        if (equipments.length > 0) {
            for (const eq of equipments) {
                query =
                    query +
                    `,
            COALESCE( re.has_${eq}, FALSE ) as has_${eq}`;
            }
        }

        query =
            query +
            `
            FROM rooms r
            LEFT JOIN room_equipment_info re ON r.room_id = re.room_id`;

        if (equipments.length > 0) {
            query =
                query +
                `
            WHERE re.has_${equipments[0]}
                  AND r.seats >= ${attendees.length}`;

            for (let i = 0; i < equipments.length; i++) {
                query = query + ` AND re.has_${equipments[i]}`;
            }
        }

        query =
            query +
            `
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
