DROP SCHEMA public CASCADE;
CREATE SCHEMA public;

CREATE TABLE cities
(
    city_id        CHAR(3) PRIMARY KEY,
    name           TEXT NOT NULL,
    province_state TEXT NOT NULL
);

CREATE TABLE buildings
(
    building_id SERIAL PRIMARY KEY,
    city_id     CHAR(3)       NOT NULL,
    code        INT           NOT NULL,
    address     TEXT          NOT NULL,
    lat         DECIMAL(9, 6) NOT NULL,
    lon         DECIMAL(9, 6) NOT NULL,
    is_active   BOOLEAN       NOT NULL,
    FOREIGN KEY (city_id) REFERENCES cities (city_id),
    UNIQUE (city_id, code)
);

CREATE TABLE rooms
(
    room_id     SERIAL PRIMARY KEY,
    building_id INT     NOT NULL,
    floor       INT     NOT NULL,
    code        TEXT    NOT NULL,
    name        TEXT,
    seats       INT     NOT NULL,
    is_active   BOOLEAN NOT NULL,
    FOREIGN KEY (building_id) REFERENCES buildings (building_id),
    UNIQUE (building_id, floor, code)
);

CREATE TABLE equipments
(
    equipment_id CHAR(2) PRIMARY KEY,
    description  TEXT NOT NULL
);

CREATE TABLE rooms_equipments
(
    room_id      INT,
    equipment_id CHAR(2),
    PRIMARY KEY (room_id, equipment_id),
    FOREIGN KEY (room_id) REFERENCES rooms (room_id),
    FOREIGN KEY (equipment_id) REFERENCES equipments (equipment_id)
);

CREATE TYPE role AS ENUM ('admin', 'staff');

CREATE TABLE users
(
    user_id     SERIAL PRIMARY KEY,
    username    TEXT    NOT NULL UNIQUE,
    first_name  TEXT    NOT NULL,
    last_name   TEXT    NOT NULL,
    email       TEXT    NOT NULL UNIQUE,
    building_id INT     NOT NULL,
    floor       INT     NOT NULL,
    desk        INT     NOT NULL,
    role        role    NOT NULL,
    is_active   BOOLEAN NOT NULL,
    FOREIGN KEY (building_id) REFERENCES buildings (building_id)
);

CREATE TABLE bookings
(
    booking_id SERIAL PRIMARY KEY,
    created_by INT       NOT NULL,
    created_at TIMESTAMP NOT NULL,
    start_time TIMESTAMP NOT NULL,
    end_time   TIMESTAMP NOT NULL,
    status     TEXT      NOT NULL,
    FOREIGN KEY (created_by) REFERENCES users (user_id)
);

CREATE TABLE events
(
    event_id   SERIAL PRIMARY KEY,
    created_by INT       NOT NULL,
    start_time TIMESTAMP NOT NULL,
    end_time   TIMESTAMP NOT NULL,
    is_active  BOOLEAN   NOT NULL,
    FOREIGN KEY (created_by) REFERENCES users (user_id)
);

CREATE TABLE users_bookings
(
    user_id    INT,
    booking_id INT,
    room_id    INT,
    PRIMARY KEY (user_id, booking_id),
    FOREIGN KEY (user_id) REFERENCES users (user_id),
    FOREIGN KEY (booking_id) REFERENCES bookings (booking_id)
);

CREATE TABLE bookings_rooms
(
    booking_id INT,
    room_id    INT,
    PRIMARY KEY (booking_id, room_id),
    FOREIGN KEY (booking_id) REFERENCES bookings (booking_id),
    FOREIGN KEY (room_id) REFERENCES rooms (room_id)
);

CREATE TABLE distances
(
    building_id_from INT,
    building_id_to   INT,
    distance        INT,
    PRIMARY KEY ( building_id_from, building_id_to )
);

INSERT INTO cities (city_id, name, province_state)
VALUES ('YVR', 'Vancouver', 'BC'),
       ('YYZ', 'Toronto', 'ON'),
       ('YUL', 'Montreal', 'QC');

INSERT INTO buildings (building_id, city_id, code, address, lat, lon, is_active)
VALUES (1, 'YVR', 32, '32 Vancouver St, Vancouver, BC A1B 2C3', 49.280299, -123.126439, TRUE),
       (2, 'YVR', 41, '41 Vancouver St, Vancouver, BC A1B 2C3', 49.280906, -123.127070, TRUE),
       (3, 'YVR', 74, '74 Vancouver St, Vancouver, BC A1B 2C3', 49.286433, -123.130863, TRUE);

SELECT setval('buildings_building_id_seq', (SELECT MAX(building_id) FROM buildings));

INSERT INTO equipments (equipment_id, description)
VALUES ('AV', 'Audio visual equipment in room'),
       ('VC', 'Video Conference equipment in room');

INSERT INTO rooms (room_id, building_id, floor, code, name, seats, is_active)
VALUES (1, 2, 1, '101', 'Stanley', 4, TRUE),
       (2, 3, 1, '102', 'Trafalgar', 6, TRUE),
       (3, 1, 1, '404', 'Lighthouse', 18, TRUE);

INSERT INTO rooms_equipments (room_id, equipment_id)
VALUES (1, 'AV'),
       (1, 'VC'),
       (3, 'AV'),
       (3, 'VC');

SELECT setval('rooms_room_id_seq', (SELECT MAX(room_id) FROM rooms));

INSERT INTO users (user_id, username, first_name, last_name, email, building_id, floor, desk, role, is_active)
VALUES (1, 'bbrown5888', 'Bob', 'Brown', 'bbrown5888@example.com', 2, 1, 105, 'staff', TRUE),
       (2, 'cdavis1530', 'Charlie', 'Davis', 'cdavis1530@example.com', 2, 1, 101, 'admin', FALSE),
       (3, 'djohnson5652', 'Diana', 'Johnson', 'djohnson5652@example.com', 1, 1, 100, 'admin', FALSE),
       (4, 'gdavis3737', 'George', 'Davis', 'gdavis3737@example.com', 3, 2, 100, 'staff', TRUE),
       (5, 'fdavis3529', 'Fiona', 'Davis', 'fdavis3529@example.com', 3, 2, 102, 'staff', TRUE),
       (6, 'hmiller1868', 'Hannah', 'Miller', 'hmiller1868@example.com', 3, 3, 105, 'admin', TRUE),
       (7, 'hgarcia1209', 'Hannah', 'Garcia', 'hgarcia1209@example.com', 1, 3, 105, 'admin', FALSE),
       (8, 'cgarcia7408', 'Charlie', 'Garcia', 'cgarcia7408@example.com', 2, 2, 104, 'staff', TRUE),
       (9, 'dbrown5140', 'Diana', 'Brown', 'dbrown5140@example.com', 2, 3, 101, 'staff', TRUE),
       (10, 'dmiller5815', 'Diana', 'Miller', 'dmiller5815@example.com', 2, 1, 104, 'admin', TRUE);

SELECT setval('users_user_id_seq', (SELECT MAX(user_id) FROM users));

INSERT INTO bookings (booking_id, created_by, created_at, start_time, end_time, status )
VALUES (1,1,'2024-03-23T12:00:00.000Z','2024-03-26T19:00:00.000Z', '2024-03-26T20:00:00.000Z','good');

INSERT INTO bookings_rooms( booking_id, room_id)
VALUES (1,1);

INSERT INTO users_bookings( user_id, booking_id, room_id )
VALUES (1,1,1), (2,1,1), (3,1,1);

INSERT INTO distances (building_id_from, building_id_to, distance)
VALUES (1,1,0), (1,2,4), (1,3,2),
       (2,1,4), (2,2,0), (2,3,1),
       (3,1,2), (3,2,1), (3,3,0);