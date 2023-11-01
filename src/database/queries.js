const { DB_NAME } = require('../utils/secrets')

const createDB = `CREATE DATABASE IF NOT EXISTS ${DB_NAME}`;

const dropDB = `DROP DATABASE IF EXISTS ${DB_NAME}`;

const createTableUSers = `
CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(50) NULL,
    last_name VARCHAR(50) NULL,
    email VARCHAR(255) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    created_on TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)
)
`;

const createNewUser = `
INSERT INTO user VALUES(null, ?, ?, ?, ?, NOW())
`;

const findUserByEmail = `
SELECT * FROM user WHERE email = ?
`;

const createNewCourse = `
INSERT INTO course VALUES(null, ?, ?, ?)
`;

const findCourseById = `
SELECT 
c.course_name,
c.credits,
c.maxNumberOfStudents, 
GROUP_CONCAT(json_object(
        'id', m.id,
        'major_name', m.major_name
        )) AS major
FROM major_course mc
JOIN course c ON mc.id_course = c.id
JOIN major m ON mc.id_major = m.id
WHERE mc.id_course = ?
GROUP BY c.course_name
`

const updateCourseById = `
UPDATE course SET course_name = ?, credits = ?, maxNumberOfStudents = ?
`

const deleteCourseById = `
DELETE FROM course WHERE id = ?
`

const createNewInstructor = `
INSERT INTO instructor VALUES(null, ?)
`;

const findInstructorById = `
SELECT * FROM instructor WHERE id = ?
`

const updateInstructorById = `
UPDATE instructor SET instructor_name = ?
`

const deleteInstructorById = `
DELETE FROM instructor WHERE id = ?
`

const createNewRoom = `
INSERT INTO room VALUES(null, ?, ?)
`;

const findRoomById = `
SELECT
		r.id,
        r.room_name,
        r.capacity,
        GROUP_CONCAT(json_object(
        'id', a.id,
        'area_name', a.area_name
        )) AS area,
        GROUP_CONCAT(json_object(
        'id', k.id,
        'kind_of_room_name', k.kind_of_room_name
        )) AS kind_of_room
        FROM room r
		JOIN area a ON r.area_id = a.id
		JOIN kind_of_room k ON k.id = r.kind_of_room_id
        where r.id = ?
        group by r.id,r.room_name,r.capacity
`

const updateRoomById = `
UPDATE room SET room_name = ?, capacity = ?
`

const deleteRoomById = `
DELETE FROM room WHERE id = ?
`

const getAreas = `
SELECT * FROM area
`
const getKindOfRooms = `
SELECT * FROM kind_of_room
`

const getRooms = `
SELECT
		r.id,
        r.room_name,
        r.capacity,
        GROUP_CONCAT(json_object(
        'id', a.id,
        'area_name', a.area_name
        )) AS area,
        GROUP_CONCAT(json_object(
        'id', k.id,
        'kind_of_room_name', k.kind_of_room_name
        )) AS kind_of_room
        FROM room r
		JOIN area a ON r.area_id = a.id
		JOIN kind_of_room k ON k.id = r.kind_of_room_id
        group by r.id,r.room_name,r.capacity
`;

const getCoursesByDepartment = `
SELECT
c.id, 
c.course_name,
c.credits,
c.maxNumberOfStudents, 
GROUP_CONCAT(json_object(
        'id', m.id,
        'major_name', m.major_name
        )) AS major
FROM major_course mc
JOIN course c ON mc.id_course = c.id
JOIN major m ON mc.id_major = m.id
WHERE mc.id_major = ?
GROUP BY c.id, c.course_name, c.credits, c.maxNumberOfStudents
`

const createNewCourseInstructor = `
INSERT INTO course_instructor VALUES(null, ?, ?)
`

const getDepartment = `
SELECT * FROM major
`

const getInstructors = `
SELECT 
i.id,
i.instructor_name,
i.email,
i.number_phone,
i.gender,
m.major_name,
GROUP_CONCAT(json_object(
        'id', c.id,
        'course_name', c.course_name
        )) AS courses
FROM course_instructor ci
JOIN course c ON ci.id_course = c.id
JOIN instructor i ON ci.id_instructor = i.id
JOIN major m ON m.id = i.major_id
GROUP BY i.id, i.instructor_name, i.email, i.number_phone
`

module.exports = {
    createDB,
    dropDB,
    createTableUSers,
    createNewUser,
    findUserByEmail,
    createNewCourse,
    findCourseById,
    updateCourseById,
    deleteCourseById,
    createNewInstructor,
    findInstructorById,
    updateInstructorById,
    deleteInstructorById,
    createNewRoom,
    findRoomById,
    updateRoomById,
    deleteRoomById,
    getRooms,
    createNewCourseInstructor,
    getAreas,
    getKindOfRooms,
    getCoursesByDepartment,
    getDepartment,
    getInstructors
};
