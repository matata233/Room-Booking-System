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
import {toBookingDTO} from "../util/Mapper/BookingMapper";

export default class BookingRepository extends AbstractRepository {
    constructor(database: PrismaClient) {
        super(database);
    }

    public async findAll(): Promise<BookingDTO[]> {
        const bookings = await this.db.bookings.findMany({
            include: {
                users: true,
                bookings_rooms: {
                    include: {
                        rooms: {
                            include: {
                                buildings: true,
                                rooms_equipments: {
                                    include: {
                                        equipments: true
                                    }
                                }
                            }
                        }
                    }
                },
                users_bookings: true
            }
        });

        const bookingDTOs: BookingDTO[] = bookings.map((booking) => {
            return toBookingDTO(booking);
        });

        return bookingDTOs;
    }

    public async findById(id: number): Promise<BookingDTO> {
        const booking = await this.db.bookings.findUnique({
            where: {
                booking_id: id
            },
            include: {
                users: true,
                bookings_rooms: {
                    include: {
                        rooms: {
                            include: {
                                buildings: true,
                                rooms_equipments: {
                                    include: {
                                        equipments: true
                                    }
                                }
                            }
                        }
                    }
                },
                users_bookings: true
            }
        });

        if (!booking) {
            return Promise.reject(new NotFoundError(`Booking not found with id: ${id}`));
        }
        const bookingDTO = toBookingDTO(booking);

        return bookingDTO;
    }

    public create(
        created_by: string,
        created_at: string,
        start_time: string,
        end_time: string,
        rooms: string[],
        attendees: string[][]
    ): Promise<BookingDTO> {
        return this.db.bookings
            .findFirst({
                where: {
                    AND: [{start_time: {lt: end_time}}, {end_time: {gt: start_time}}]
                }
            })
            .then((res) => {
                if (res !== null) {
                    // TODO: can add to error message to indicate which rooms are unavailable
                    throw new RequestConflictError("Time Slot Unavailable");
                }
                return this.db.users.findUnique({
                    where: {username: created_by}
                });
            })
            .then((created_by_id) => {
                if (!created_by_id) {
                    throw new NotFoundError("User Creating Booking Not Found");
                }
                return this.db.bookings.create({
                    data: {
                        created_by: created_by_id.user_id,
                        created_at: created_at,
                        start_time: start_time,
                        end_time: end_time,
                        status: "good",
                        users_bookings: {
                            create: attendees[0].map((username) => ({
                                users: {
                                    connect: {username}
                                }
                            }))
                        },
                        bookings_rooms: {
                            create: rooms
                                .map((room_id) => parseInt(room_id))
                                .map((room_id) => ({
                                    rooms: {
                                        connect: {room_id}
                                    }
                                }))
                        }
                    },
                    include: {
                        users_bookings: true,
                        bookings_rooms: true
                    }
                });
            });
    }

    public getSuggestedTimes(
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
        return this.getCityId(attendees[0]).then((city_code) => {
            const query = this.buildTimeSuggestionQuery(
                start_time,
                end_time,
                duration,
                attendees,
                equipments,
                step_size,
                city_code
            );
            return this.db.$queryRawUnsafe(query);
        });
    }

    public getAvailableRooms(
        start_time: string,
        end_time: string,
        attendees: string[],
        equipments: string[],
        priority: string[]
    ): Promise<object> {
        let city_code: string;
        return this.getUnavailableAttendees(attendees, start_time, end_time)
            .then((res) => {
                if (res.length > 0) {
                    return Promise.reject(new UnavailableAttendeesError(JSON.stringify(res)));
                }
                return this.getCityId(attendees[0]);
            })
            .then((res) => {
                city_code = res;
                return this.getBuildingFloor(attendees);
            })
            .then((buildingFloorList: AggregateAttendeeDTO[]) => {
                // TODO: implement automatic multi room allocation
                const closest_building_id = buildingFloorList[0].building_id;
                const floor = buildingFloorList[0].floor as number;
                const query = this.buildQuery(
                    start_time,
                    end_time,
                    attendees,
                    equipments,
                    priority,
                    closest_building_id,
                    city_code,
                    floor
                );
                return this.db.$queryRawUnsafe(query);
            })
            .then((res) => {
                return {
                    groups: [
                        {
                            attendees: attendees,
                            rooms: res
                        }
                    ]
                };
            });
    }

    private getUnavailableAttendees(attendees: string[], start_time: string, end_time: string): Promise<users[]> {
        return this.db.users.findMany({
            where: {
                email: {
                    in: attendees
                },
                bookings: {
                    some: {
                        AND: [{start_time: {lt: end_time}}, {end_time: {gt: start_time}}]
                    }
                }
            }
        });
    }

    private getCityId(email: string): Promise<string> {
        return this.db.users
            .findUnique({
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
            })
            .then((res) => {
                if (res === null) {
                    return Promise.reject(new NotFoundError(`User ${email} not found`));
                }
                return res.buildings.city_id;
            });
    }

    // TODO: currently taking user_ids not email nor username
    private getBuildingFloor(attendees: string[]): Promise<AggregateAttendeeDTO[]> {
        let userList = `(`;
        for (let i = 0; i < attendees.length; i++) {
            userList = userList + `\'${attendees[i]}\'`;
            if (i !== attendees.length - 1) {
                userList = userList + ",";
            }
        }
        userList = userList + `)`;

        const query = `
        WITH user_counts AS (
            SELECT building_id, COUNT(*) AS num_users
            FROM users
            WHERE email IN ${userList}
            GROUP BY building_id
        ),
        max_floor_per_building AS (
            SELECT building_id, floor
            FROM (
              SELECT building_id, floor,
                     ROW_NUMBER() OVER(PARTITION BY building_id ORDER BY COUNT(*) DESC) AS rn
              FROM users
              WHERE email IN ${userList}
              GROUP BY building_id, floor
            ) t
            WHERE rn = 1
        )
        SELECT uc.building_id, uc.num_users, mfp.floor
        FROM user_counts uc
        JOIN max_floor_per_building mfp ON uc.building_id = mfp.building_id
        ORDER BY num_users DESC`;

        return this.db.$queryRawUnsafe(query).then((ret) => {
            const res: AggregateAttendeeDTO[] = [];
            (ret as AggregateAttendeeDTO[]).forEach((entry) => {
                res.push(entry);
            });
            const sum = res.map((entry) => Number(entry.num_users)).reduce((a, b) => a + b);
            if (sum !== attendees.length) {
                return Promise.reject(new NotFoundError("Some users not found"));
            }
            return Promise.resolve(res);
        });
    }

    private buildQuery(
        start_time: string,
        end_time: string,
        attendees: string[],
        equipments: string[],
        priority: string[],
        closest_building_id: string,
        city_code: string,
        floor_from: number
    ): string {
        let query = `
        WITH room_equipment_info AS (
            SELECT room_id`;

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
        room_distance_info AS (
            SELECT r.*,`;

        equipments.forEach((eq) => {
            query =
                query +
                `
                COALESCE(re.has_${eq}, FALSE) as has_${eq},`;
        });

        query =
            query +
            `
                d.distance
            FROM rooms r
            LEFT JOIN room_equipment_info as re ON r.room_id = re.room_id
            LEFT JOIN distances d ON r.building_id = d.building_id_to
            WHERE d.building_id_from=${closest_building_id} AND r.seats >= ${attendees.length}
        ),
        available_rooms AS (
            SELECT room_distance_info.* 
            FROM room_distance_info
            LEFT JOIN buildings b ON b.building_id = room_distance_info.building_id
            WHERE b.city_id = '${city_code}'
            AND room_distance_info.room_id NOT IN (
                SELECT br.room_id FROM bookings_rooms as br
                LEFT JOIN bookings as b ON b.booking_id = br.booking_id
                WHERE
                (( NOT (( b.start_time >= '${end_time}' OR b.end_time <= '${start_time}')
                    AND ( b.booking_id IS NOT NULL))) AND br.room_id IS NOT NULL)
            )
        )
        SELECT *
        FROM available_rooms
        ORDER BY
            available_rooms.distance,`;

        priority.forEach((eq) => {
            query =
                query +
                `
            CASE
                WHEN has_${eq} THEN 0
                ELSE 1
            END,`;
        });

        query =
            query +
            `
            CASE
                WHEN available_rooms.building_id=${closest_building_id} THEN ABS(available_rooms.floor-${floor_from})
                ELSE 10000
            END,
            available_rooms.seats`;

        return query;
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
            userList = userList + `\'${attendees[i]}\'`;
            if (i !== attendees.length - 1) {
                userList = userList + ",";
            }
        }
        userList = userList + `)`;
        let query = `
        WITH RECURSIVE dates AS (
            SELECT TIMESTAMP '${start_time}' AS dt
            UNION ALL
            SELECT dt + INTERVAL '${step_size}' FROM dates WHERE dt + INTERVAL '${step_size}' < TIMESTAMP '${end_time}'
        ),
        room_availability AS (
            SELECT DISTINCT r.room_id, b2.start_time, b2.end_time
            FROM rooms r
            LEFT JOIN buildings b ON r.building_id = b.building_id
            LEFT JOIN bookings_rooms br ON r.room_id = br.room_id
            LEFT JOIN bookings b2 ON br.booking_id = b2.booking_id
            WHERE b.city_id = '${city_code}' AND (b2.start_time < '${end_time}' OR b2.end_time > '${start_time}' )
        ),
        user_ids AS (
            SELECT u.user_id
            FROM users u
            WHERE u.email IN ${userList}
        ),
        user_bookings_overlap AS (
            SELECT ub.user_id, b.start_time, b.end_time
            FROM users_bookings ub
            JOIN bookings b ON ub.booking_id = b.booking_id
            WHERE b.start_time < '${end_time}' AND b.end_time > '${start_time}' AND ub.user_id IN ( SELECT user_id from user_ids )
        ),
        room_equipment_info AS (
            SELECT room_id`;

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
}
