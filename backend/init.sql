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
    role        INT     NOT NULL,
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

CREATE TABLE users_bookings
(
    user_id    INT,
    booking_id INT,
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

INSERT INTO cities (city_id, name, province_state)
VALUES ('YVR', 'Vancouver', 'BC'),
       ('YYZ', 'Toronto', 'ON'),
       ('YUL', 'Montreal', 'QC');

INSERT INTO buildings (building_id, city_id, code, address, lat, lon, is_active)
VALUES (1, 'YVR', 32, '32 Vancouver St, Vancouver, BC A1B 2C3', 49.280299, -123.126439, TRUE),
       (2, 'YVR', 41, '41 Vancouver St, Vancouver, BC A1B 2C3', 49.280906, -123.127070, TRUE),
       (3, 'YVR', 74, '74 Vancouver St, Vancouver, BC A1B 2C3', 49.286433, -123.130863, TRUE),
       (4, 'YVR', 63, '63 Vancouver St, Vancouver, BC A1B 2C3', 49.288339, -123.130542, TRUE),
       (5, 'YVR', 73, '73 Vancouver St, Vancouver, BC A1B 2C3', 49.292155, -123.129119, TRUE),
       (6, 'YYZ', 34, '34 Toronto St, Toronto, ON D1E 2F3', 43.649982, -79.380446, TRUE),
       (7, 'YUL', 22, '22 Montreal St, Montreal, QC G1H 2I3', 45.502746, -73.560693, TRUE);

INSERT INTO equipments (equipment_id, description)
VALUES ('AV', 'Audio visual equipment in room'),
       ('VC', 'Video Conference equipment in room');

INSERT INTO rooms (room_id, building_id, floor, code, name, seats, is_active)
VALUES (1, 1, 1, '101', 'Stanley', 4, TRUE),
       (2, 1, 1, '102', 'Trafalgar', 6, TRUE),
       (3, 1, 1, '404', 'Lighthouse', 18, TRUE),
       (4, 1, 1, '405', 'Earles Casual', 4, TRUE),
       (5, 1, 1, '406', 'Riley', 8, TRUE),
       (6, 1, 2, '101', 'Yaletown', 4, TRUE),
       (7, 1, 2, '102', 'Kerrisdale', 6, TRUE),
       (8, 1, 2, '103', 'Gastown', 16, TRUE),
       (9, 1, 2, '404', 'Killarney', 18, TRUE),
       (10, 1, 2, '405', 'Grandview Casual', 5, TRUE),
       (11, 1, 2, '406', 'Marpole', 10, TRUE),
       (12, 1, 3, '101', 'Chickadee', 4, TRUE),
       (13, 1, 3, '102', 'Reservoir', 6, TRUE),
       (14, 1, 3, '103', 'Thompson', 16, TRUE),
       (15, 1, 3, '404', 'Brockton', 18, TRUE),
       (16, 1, 3, '405', 'Kinglet Casual', 5, TRUE),
       (17, 1, 3, '406', 'Ravine', 10, TRUE),
       (18, 1, 4, '100', 'Interview', 4, TRUE),
       (19, 1, 4, '101', 'Interview', 4, TRUE),
       (20, 1, 4, '203', 'English Bay Combinable', 38, TRUE),
       (21, 1, 4, '204', 'Sunset Combinable', 38, TRUE),
       (22, 1, 4, '300', 'Jericho', 26, TRUE),
       (23, 1, 5, '101', 'Sockeye', 4, TRUE),
       (24, 1, 5, '102', 'Coho', 6, TRUE),
       (25, 1, 5, '103', 'Chinook', 16, TRUE),
       (26, 1, 5, '403', NULL, 14, TRUE),
       (27, 1, 5, '404', 'Char', 18, TRUE),
       (28, 1, 5, '405', 'Steelhead Casual', 5, TRUE),
       (29, 1, 5, '406', 'Kokanee', 10, TRUE),
       (30, 1, 6, '101', 'Okanagan', 4, TRUE),
       (31, 1, 6, '102', 'Buntzen', 6, TRUE),
       (32, 1, 6, '103', 'Elfin', 16, TRUE),
       (33, 1, 6, '403', 'Babine', 14, TRUE),
       (34, 1, 6, '404', 'Ootsa', 18, TRUE),
       (35, 1, 6, '405', 'Sprott Casual', 5, TRUE),
       (36, 1, 6, '406', 'Kootenay', 10, TRUE),
       (37, 1, 7, '100', 'Eagle', 10, TRUE),
       (38, 1, 7, '101', 'Lynx', 18, TRUE),
       (39, 1, 7, '404', 'Kermode', 4, TRUE),
       (40, 1, 7, '405', 'Orca', 4, TRUE),
       (41, 1, 7, '406', 'Moose Casual', 5, TRUE),
       (42, 1, 7, '407', 'Raccoon', 12, TRUE);

INSERT INTO rooms_equipments (room_id, equipment_id)
VALUES (1, 'AV'),
       (1, 'VC'),
       (3, 'AV'),
       (3, 'VC'),
       (4, 'VC'),
       (5, 'AV'),
       (5, 'VC'),
       (6, 'AV'),
       (6, 'VC'),
       (8, 'VC'),
       (9, 'AV'),
       (9, 'VC'),
       (12, 'AV'),
       (12, 'VC'),
       (13, 'AV'),
       (13, 'VC'),
       (14, 'AV'),
       (14, 'VC'),
       (15, 'AV'),
       (15, 'VC'),
       (17, 'AV'),
       (17, 'VC'),
       (20, 'AV'),
       (20, 'VC'),
       (21, 'AV'),
       (21, 'VC'),
       (22, 'AV'),
       (22, 'VC'),
       (23, 'AV'),
       (23, 'VC'),
       (25, 'AV'),
       (25, 'VC'),
       (26, 'AV'),
       (26, 'VC'),
       (27, 'AV'),
       (27, 'VC'),
       (30, 'AV'),
       (30, 'VC'),
       (32, 'AV'),
       (32, 'VC'),
       (33, 'AV'),
       (33, 'VC'),
       (34, 'AV'),
       (34, 'VC'),
       (38, 'AV'),
       (38, 'VC'),
       (40, 'AV'),
       (40, 'VC'),
       (42, 'AV'),
       (42, 'VC');

INSERT INTO rooms (room_id, building_id, floor, code, name, seats, is_active)
VALUES (43, 2, 1, '401', 'Interview Room', 4, TRUE),
       (44, 2, 2, '100', NULL, 4, TRUE),
       (45, 2, 2, '101', NULL, 4, TRUE),
       (46, 2, 2, '103', NULL, 12, TRUE),
       (47, 2, 2, '104', NULL, 4, TRUE),
       (48, 2, 2, '105', NULL, 18, TRUE),
       (49, 2, 2, '200', NULL, 4, TRUE),
       (50, 2, 2, '201', NULL, 4, TRUE),
       (51, 2, 2, '204', NULL, 14, TRUE),
       (52, 2, 2, '401', NULL, 12, TRUE),
       (53, 2, 3, '100', NULL, 8, TRUE),
       (54, 2, 3, '101', NULL, 4, TRUE),
       (55, 2, 3, '102', NULL, 12, TRUE),
       (56, 2, 3, '103', NULL, 4, TRUE),
       (57, 2, 3, '104', NULL, 18, TRUE),
       (58, 2, 3, '200', NULL, 10, TRUE),
       (59, 2, 3, '201', NULL, 14, TRUE),
       (60, 2, 3, '301', NULL, 4, TRUE),
       (61, 2, 3, '302', NULL, 4, TRUE),
       (62, 2, 3, '400', NULL, 12, TRUE),
       (63, 2, 4, '100', NULL, 8, TRUE),
       (64, 2, 4, '101', NULL, 4, TRUE),
       (65, 2, 4, '102', 'Conference Room', 12, TRUE),
       (66, 2, 4, '103', NULL, 4, TRUE),
       (67, 2, 4, '104', NULL, 18, TRUE),
       (68, 2, 4, '200', NULL, 6, TRUE),
       (69, 2, 4, '201', NULL, 6, TRUE),
       (70, 2, 4, '202', NULL, 14, TRUE),
       (71, 2, 4, '300', NULL, 4, TRUE),
       (72, 2, 4, '301', NULL, 4, TRUE),
       (73, 2, 4, '302', NULL, 4, TRUE),
       (74, 2, 5, '102', NULL, 5, TRUE),
       (75, 2, 5, '200', NULL, 14, TRUE),
       (76, 2, 5, '201', NULL, 8, TRUE),
       (77, 2, 5, '202', NULL, 4, TRUE),
       (78, 2, 5, '203', NULL, 4, TRUE),
       (79, 2, 5, '204', NULL, 4, TRUE),
       (80, 2, 5, '205', NULL, 4, TRUE),
       (81, 2, 5, '206', NULL, 18, TRUE),
       (82, 2, 5, '300', NULL, 6, TRUE),
       (83, 2, 5, '301', NULL, 4, TRUE),
       (84, 2, 6, '100', NULL, 4, TRUE),
       (85, 2, 6, '101', NULL, 4, TRUE),
       (86, 2, 6, '102', NULL, 12, TRUE),
       (87, 2, 6, '103', NULL, 4, TRUE),
       (88, 2, 6, '301', NULL, 6, TRUE),
       (89, 2, 7, '100', NULL, 12, TRUE),
       (90, 2, 7, '101', NULL, 8, TRUE),
       (91, 2, 7, '102', NULL, 4, TRUE),
       (92, 2, 7, '103', NULL, 18, TRUE),
       (93, 2, 7, '200', NULL, 4, TRUE),
       (94, 2, 7, '201', NULL, 14, TRUE),
       (95, 2, 7, '300', NULL, 8, TRUE),
       (96, 2, 7, '301', NULL, 4, TRUE),
       (97, 2, 7, '304', NULL, 4, TRUE),
       (98, 2, 7, '400', NULL, 8, TRUE),
       (99, 2, 8, '300', 'Boardroom', 22, TRUE),
       (100, 2, 8, '301', 'Boardroom Combinable', 30, TRUE),
       (101, 2, 8, '302', 'Boardroom Combinable', 30, TRUE),
       (102, 2, 9, '100', NULL, 10, TRUE),
       (103, 2, 9, '101', NULL, 4, TRUE),
       (104, 2, 9, '102', NULL, 4, TRUE),
       (105, 2, 9, '103', NULL, 8, TRUE),
       (106, 2, 9, '201', NULL, 4, TRUE),
       (107, 2, 9, '202', NULL, 4, TRUE),
       (108, 2, 9, '300', NULL, 4, TRUE);

INSERT INTO rooms_equipments (room_id, equipment_id)
VALUES (44, 'AV'),
       (44, 'VC'),
       (45, 'AV'),
       (45, 'VC'),
       (46, 'AV'),
       (46, 'VC'),
       (47, 'AV'),
       (47, 'VC'),
       (48, 'AV'),
       (48, 'VC'),
       (49, 'AV'),
       (49, 'VC'),
       (50, 'AV'),
       (50, 'VC'),
       (51, 'AV'),
       (51, 'VC'),
       (52, 'AV'),
       (52, 'VC'),
       (53, 'AV'),
       (53, 'VC'),
       (54, 'AV'),
       (54, 'VC'),
       (55, 'AV'),
       (55, 'VC'),
       (56, 'AV'),
       (56, 'VC'),
       (57, 'AV'),
       (57, 'VC'),
       (58, 'AV'),
       (58, 'VC'),
       (59, 'AV'),
       (59, 'VC'),
       (60, 'AV'),
       (60, 'VC'),
       (61, 'AV'),
       (61, 'VC'),
       (62, 'AV'),
       (62, 'VC'),
       (63, 'AV'),
       (63, 'VC'),
       (64, 'AV'),
       (64, 'VC'),
       (65, 'AV'),
       (65, 'VC'),
       (66, 'AV'),
       (66, 'VC'),
       (67, 'AV'),
       (67, 'VC'),
       (68, 'AV'),
       (68, 'VC'),
       (69, 'AV'),
       (69, 'VC'),
       (70, 'AV'),
       (70, 'VC'),
       (71, 'AV'),
       (71, 'VC'),
       (72, 'AV'),
       (72, 'VC'),
       (73, 'AV'),
       (73, 'VC'),
       (74, 'AV'),
       (74, 'VC'),
       (75, 'AV'),
       (75, 'VC'),
       (76, 'AV'),
       (76, 'VC'),
       (77, 'AV'),
       (77, 'VC'),
       (78, 'AV'),
       (78, 'VC'),
       (79, 'AV'),
       (79, 'VC'),
       (80, 'AV'),
       (80, 'VC'),
       (81, 'AV'),
       (81, 'VC'),
       (82, 'AV'),
       (82, 'VC'),
       (83, 'AV'),
       (83, 'VC'),
       (84, 'AV'),
       (84, 'VC'),
       (85, 'AV'),
       (85, 'VC'),
       (86, 'AV'),
       (86, 'VC'),
       (87, 'AV'),
       (87, 'VC'),
       (88, 'AV'),
       (88, 'VC'),
       (89, 'AV'),
       (89, 'VC'),
       (90, 'AV'),
       (90, 'VC'),
       (91, 'AV'),
       (91, 'VC'),
       (92, 'AV'),
       (92, 'VC'),
       (93, 'AV'),
       (93, 'VC'),
       (94, 'AV'),
       (94, 'VC'),
       (95, 'AV'),
       (95, 'VC'),
       (96, 'AV'),
       (96, 'VC'),
       (97, 'AV'),
       (97, 'VC'),
       (98, 'AV'),
       (98, 'VC'),
       (99, 'AV'),
       (99, 'VC'),
       (100, 'AV'),
       (100, 'VC'),
       (101, 'AV'),
       (101, 'VC'),
       (102, 'AV'),
       (102, 'VC'),
       (103, 'AV'),
       (103, 'VC'),
       (104, 'AV'),
       (104, 'VC'),
       (105, 'AV'),
       (105, 'VC'),
       (106, 'AV'),
       (106, 'VC'),
       (107, 'AV'),
       (107, 'VC'),
       (108, 'AV'),
       (108, 'VC');

INSERT INTO rooms (room_id, building_id, floor, code, name, seats, is_active)
VALUES (501, 7, 1, '007.A', NULL, 10, TRUE),
       (502, 7, 1, '007.B', NULL, 2, TRUE),
       (503, 7, 1, '007.C', NULL, 2, TRUE),
       (504, 7, 7, '007.D', NULL, 2, TRUE),
       (505, 7, 2, 'A', 'Conference', 10, TRUE),
       (506, 7, 2, 'B', 'Huddle', 4, TRUE),
       (507, 7, 2, 'C', 'Huddle', 4, TRUE),
       (508, 7, 2, 'D', 'Conference', 5, TRUE),
       (509, 7, 2, 'E', 'Conference', 5, TRUE),
       (510, 7, 2, 'F', 'Conference', 5, TRUE);

INSERT INTO users (user_id, username, first_name, last_name, email, building_id, floor, desk, role, is_active)
VALUES (1, 'jli', 'John', 'Li', 'jli12378@gmail.com', 1, 1, 101, 0, TRUE),
       (2, 'tsimpson', 'Taylor', 'Simpson', 'tsimpson82348@gmail.com', 1, 1, 102, 1, TRUE);
