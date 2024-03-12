import AbstractRepository from "./AbstractRepository";
import RoomDTO from "../model/dto/RoomDTO";
import BookingDTO from "../model/dto/BookingDTO";
import AggregateAttendeeDTO from "../model/dto/AggregateAttendeeDTO";
import { PrismaClient, rooms, users } from "@prisma/client";
import { NotFoundError, RequestConflictError, UnavailableAttendeesError } from "../util/exception/AWSRoomBookingSystemError";

export default class BookingRepository extends AbstractRepository {

    constructor( database: PrismaClient ) {
        super( database );
    }
    
    public findAll(): Promise<BookingDTO[]> {
        return Promise.reject( "Not Implemented" ); 
    }

    public findById(id: number): Promise<BookingDTO | null> {
        return Promise.reject( "Not Implemented" ); 
    }


    public create( created_by: string,
                   created_at: string,
                   start_time: string, 
                   end_time: string, 
                   rooms: string[],
                   attendees: string[] ): Promise<BookingDTO> {
        return this.db.bookings.findFirst({
            where: {
                AND: [
                    { start_time: { lt: end_time } },
                    { end_time: { gt: start_time } }
                ]
            }
        })
        .then( ( res ) => {
            if( res !== null ) 
                // TODO: can add to error message to indicate which rooms are unavailable
                throw new RequestConflictError( "Time Slot Unavailable" );
            return this.db.users.findUnique({
                where: { username: created_by }
            });
        })
        .then( ( created_by_id ) => {
            if( !created_by_id )
                throw new NotFoundError( "User Creating Booking Not Found");
            return this.db.bookings.create({
                data: {
                    created_by: created_by_id.user_id,
                    created_at: created_at,
                    start_time: start_time,
                    end_time: end_time,
                    status: 'good',
                    users_bookings: {
                        create: attendees.map( username => ({
                            users: {
                                connect: { username }
                            }
                        }))
                    },
                    bookings_rooms: {
                        create: rooms.map( room_id => parseInt( room_id ) )
                        .map( room_id  => ({
                            rooms: {
                                connect: { room_id }
                            }
                        }))
                    }
                },
                include: {
                    users_bookings: true,
                    bookings_rooms: true
                }
            })
                     
        });
    }

    public getAvailableRooms( start_time: string, 
                               end_time: string,
                               attendees: string[],
                               equipments: string[],
                               priority: string[] ): Promise<Object> {
        let city_code: string;
        return this.getUnavailableAttendees( attendees, start_time, end_time )
        .then( ( res ) => {
            if( res.length > 0 ) {
                return Promise.reject( new UnavailableAttendeesError( JSON.stringify( res ) ) );
            }
            return this.getCityId( attendees[ 0 ] )
        })
        .then( ( res ) =>  {
            city_code = res;
            return this.getBuildingFloor( attendees )
        })
        .then( ( buildingFloorList: AggregateAttendeeDTO[] ) => {
            // TODO: implement automatic multi room allocation
            let closest_building_id = buildingFloorList[ 0 ].building_id;
            let floor = buildingFloorList[ 0 ].floor as number;
            let query = this.buildQuery( start_time, end_time, attendees, equipments, priority, closest_building_id, city_code, floor);
            return this.db.$queryRawUnsafe( query );
        })
        .then( ( res ) => {
            return {
                'groups': [
                    {
                        'attendees': attendees,
                        'rooms': res
                    }
                ]
            };
        })
    }

    private getUnavailableAttendees( attendees: string[], start_time: string, end_time: string ): Promise<users[]> {
        return this.db.users.findMany({ 
            where: {
                email: {
                    in: attendees
                },
                bookings: {
                    some: {
                        AND: [
                            { start_time: { lt: end_time } },
                            { end_time: { gt: start_time } }
                        ]
                    }
                }
            }
        });
    }

    public getCityId( email: string ): Promise<string> {
        return this.db.users.findUnique({
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
        .then( ( res ) => {
            if( res == null ) 
                return Promise.reject( new NotFoundError( `User ${email} not found` ) );
            return res.buildings.city_id 
        })
    }

    // TODO: currently taking user_ids not email nor username
    public getBuildingFloor( attendees: string[] ): Promise<AggregateAttendeeDTO[]> {
        let userList = `(`;
        for( let i=0; i < attendees.length; i++ ) {
            userList = userList + `\'${attendees[ i ]}\'`;
            if( i != attendees.length-1 )
            userList = userList + ',';
        }
        userList = userList + `)`;

        let query = `
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
        
        return this.db.$queryRawUnsafe( query )
        .then( ( ret ) => {
            let res: AggregateAttendeeDTO[] = [];
            ( ret as AggregateAttendeeDTO[] ).forEach( ( entry ) => { res.push( entry )});
            let sum = res.map( entry=>Number(entry.num_users) ).reduce( (a,b) => a+b )
            if( sum != attendees.length ) {                
                return Promise.reject( new NotFoundError( "Some users not found" ) );
            }
            return Promise.resolve( res );
        });  
    }

    private buildQuery( start_time: string, 
                        end_time: string,
                        attendees: string[],
                        equipments: string[],
                        priority: string[],
                        closest_building_id: string,
                        city_code: string,
                        floor_from: number ): string {
        let query = `
        WITH room_equipment_info AS (
            SELECT room_id`;
    
        equipments.forEach( ( eq ) => {
            let toAdd = `,\n            bool_or(equipment_id='${eq}') AS has_${eq}`
            query = query + toAdd
        });
    
        query = query + `
            FROM rooms_equipments
            GROUP by room_id
        ),
        room_distance_info AS (
            SELECT r.*,`;
    
        equipments.forEach( ( eq ) => {
            query = query + `
                COALESCE(re.has_${eq}, FALSE) as has_${eq},`
        });
    
        query = query + `
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
    
        priority.forEach( ( eq ) => {
            query = query + `
            CASE
                WHEN has_${eq} THEN 0
                ELSE 1
            END,`
        });
    
        query = query + `
            CASE
                WHEN available_rooms.building_id=${closest_building_id} THEN ABS(available_rooms.floor-${floor_from})
                ELSE 10000
            END,
            available_rooms.seats`
    
    
        return query;
    }
}