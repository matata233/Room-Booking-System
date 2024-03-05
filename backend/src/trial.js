"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const client_1 = require("@prisma/client");
const prisma = new client_1.PrismaClient({
    log: [ 'query']
});

// error of up to .5%
function haversine( lat1, lon1, lat2, lon2 ) {
    var R = 6371;
    var dlat = ( lat2 - lat1 ) * Math.PI / 180;
    var dlon = ( lon2 - lon1 ) * Math.PI / 180;
    var a = Math.sin( dlat/2 ) * Math.sin( dlat / 2 ) 
            + Math.cos( lat1 * Math.PI/180 ) * Math.cos( lat2 * Math.PI/180 ) * Math.sin( dlon/2) * Math.sin( dlon/2 );
    var c = 2 * Math.atan2( Math.sqrt( a ), Math.sqrt( 1-a ) );
    var d = R * c;
    return d;
}

async function get_available_rooms( st, et) {
    const ret = await prisma.rooms.findMany({
        where: {
            // room_id: 1,
            buildings: {
                city_id: 'YVR'
            },
            bookings_rooms: {
                every: {
                    // all bookings either start after the requested booking ends or end before the requested booking starts
                    bookings: {
                        OR: [
                            {start_time: {
                                //start time must be before the end time
                                gte: et
                            }},
                            {end_time: {    
                                //end time must be before the start tiem
                                lte: st
                            }}
                        ]
                    }
                }
            }
        },
        // orderBy: {
        //     rooms_equipments
        // }
    });
    console.log("Returned with result:");
    console.log(ret);
}

async function make_booking( room, cb, ca, st, et, status="good" ) {
    let bi;
    return prisma.bookings.create({
        data: {
            created_by: cb,
            created_at: ca,
            start_time: st,
            end_time: et,
            status: status
        }
    }).then( () => {
        return prisma.bookings.findFirst({
            where: {
                created_by: cb,
                created_at: ca
            }
        }) 
    }).then( ( ret ) => {
        bi = ret.booking_id;
        prisma.users_bookings.create({
            data: {
                user_id: cb,
                booking_id: bi
            }
        })
        // console.log()
    }).then( () => {
        return prisma.bookings_rooms.create({
            data: {
                booking_id: bi,
                room_id: room
            }
        })
    })
}

async function get_bookings( users=false, 
                             bookings_rooms=false, 
                             users_bookings=false) {
    return prisma.bookings.findMany({
        include: {
            users: users,
            bookings_rooms: bookings_rooms,
            users_bookings: users_bookings
        }
    }).then( ( ret ) => {
        console.log( ret )
    })
}

async function get_rooms( room=-1 ) {
    return prisma.rooms.findMany({
        include: {
            bookings_rooms: true,
            buildings: true,
            rooms_equipments: true
        }
    }).then( ( ret ) => {
        if( room == -1 )
            console.log( ret )
        else 
            console.log( ret[ room ] )
    })
}

async function main() { 
    // const ret = await prisma.rooms.findMany({
    //     include: {
    //         bookings_rooms: true,
    //         buildings: true,
    //         rooms_equipments: true
    //     },
    //     orderBy: {
    //         rooms_equipments: {
                
    //             _count: 'asc'
    //         }
    //     }
    // });
    let ca = new Date(2024, 2, 21, 18, 0, 0)
    let st = new Date(2024, 2, 26, 12, 0, 0)
    let et = new Date(2024, 2, 26, 13, 0, 0)
    console.log(st)
    console.log(et)
    console.log()
    // await get_available_rooms( st, et )
    // await make_booking( 2, 2, ca, st, et)
    // await get_bookings( true,true,true)
    // await get_rooms( 0 )

    // const ret = await prisma.$queryRaw`
    // SELECT rooms.*,
    //        COALESCE(has_av, FALSE) AS has_av,
    //        COALESCE(has_vc, FALSE) AS has_vc
    // FROM rooms
    // LEFT JOIN (
    //     SELECT room_id,
    //            bool_or(equipment_id='AV') AS has_av,
    //            bool_or(equipment_id='VC') as has_vc
    //     FROM rooms_equipments
    //     GROUP BY room_id
    // ) re ON rooms.room_id = re.room_id
    // ORDER BY
    //     CASE
    //         WHEN has_av THEN 0
    //         ELSE 1
    //     END,
    //     CASE
    //         WHEN has_vc THEN 0
    //         ELSE 1
    //     END
    // `

//     let k = `SELECT rooms.*,
//     COALESCE(has_av, FALSE) AS has_av,
//     COALESCE(has_vc, FALSE) AS has_vc
// FROM rooms
// LEFT JOIN (
//  SELECT room_id,
//         bool_or(equipment_id='AV') AS has_av,
//         bool_or(equipment_id='VC') as has_vc
//  FROM rooms_equipments
//  GROUP BY room_id
// ) re ON rooms.room_id = re.room_id
// ORDER BY
//  CASE
//      WHEN has_av THEN 0
//      ELSE 1
//  END,
//  CASE
//      WHEN has_vc THEN 0
//      ELSE 1
//  END`
//  const ret = await prisma.$queryRawUnsafe(k)

    console.log("returned");
    console.log(ret)
}

main()
    .then(async () => {
    await prisma.$disconnect();
})
    .catch(async (e) => {
    console.log(e);
    await prisma.$disconnect();
    process.exit(1);
});


/* RAW QUERY

WITH room_equipment_info AS (
    SELECT room_id,
           bool_or(equipment_id='AV') AS has_av,
           bool_or(equipment_id='VC') AS has_vc
    FROM rooms_equipments
    GROUP BY room_id
),
room_distance_info AS (
    SELECT r.*,
           COALESCE(re.has_av, FALSE) AS has_av,
           COALESCE(re.has_vc, FALSE) AS has_vc,
           d.distance
    FROM rooms r
    LEFT JOIN room_equipment_info re ON r.room_id = re.room_id
    LEFT JOIN distances d ON r.building_id = d.building_id_to
    WHERE d.building_id_from = 2 AND d.seats >= 2
),
available_rooms AS (
    SELECT room_distance_info.*
    FROM room_distance_info
    LEFT JOIN buildings b ON b.building_id = room_distance_info.building_id
    WHERE b.city_id = 'YVR'
    AND room_distance_info.room_id NOT IN (
        SELECT t2.room_id FROM bookings_rooms as t2
        LEFT JOIN bookings as j3 ON j3.booking_id = t2.booking_id
        WHERE 
        (( NOT (( j3.start_time >= '2024-03-26 20:00:00' OR j3.end_time <= '2024-03-26 19:00:00')
                AND (j3.booking_id IS NOT NULL))) AND t2.room_id IS NOT NULL)
    )
)
SELECT *
FROM available_rooms
ORDER BY 
	available_rooms.distance
    available_rooms.seats
    CASE
        WHEN available_rooms.building_id=2 THEN ABS(available_rooms.floor-3)
        ELSE 100000
    END,
	CASE
        WHEN has_av THEN 0
        ELSE 1
    END,
    CASE
        WHEN has_vc THEN 0
        ELSE 1
    END,
	




*/

/*
    Issues:
        Prisma kinda sucks actually. It has no feature to sort by relation, it can only count
        There are 2 ways to solve the problem:
            either use Prisma to find available rooms and then sort in the ts code (think its bad cuz we would need to aggregatte by hand likely)
            or write the query by hand
        Im not sure if the model setup for distances is right
        How shitty is my query?
        If we have a room really far away that has all the capabilities we wish (and no other room like that) and a room really close to use but which lacks some capabilities, what are we giving priority here then?
        Are we going to do 2 api calls for the booking?
        Do we want to have the booking amking show all capabilitiies?
        On /bookings/create do we need to pass all fields for the user?
        On both /bookings/create and /bookings/available-rooms do we need to pass numSeat?
        How well populated do we need to have the database be for the WIP?
        Floor priority for other buildings
        Is Timestamp the UNIX timestamp?
        Why duration instead of endtime to conform with the data model and with the frontend?
*/