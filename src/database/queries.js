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
INSERT INTO course VALUES(null, ?, ?)
`;

const findCourseById = `
SELECT * FROM course WHERE id = ?
`

const updateCourseById = `
UPDATE course SET course_name = ?, maximum_number_of_student = ?
`

const deleteCourseById = `
DELETE FROM course WHERE id = ?
`

const createNewInstructor = `
INSERT INTO instructor VALUES(null, ?, ?)
`;

const findInstructorById = `
SELECT * FROM instructor WHERE id = ?
`

const updateInstructorById = `
UPDATE instructor SET course_name = ?, maximum_number_of_student = ?
`

const deleteInstructorById = `
DELETE FROM instructor WHERE id = ?
`

const createNewRoom = `
INSERT INTO room VALUES(null, ?, ?)
`;

const findRoomById = `
SELECT * FROM room WHERE id = ?
`

const updateRoomById = `
UPDATE room SET course_name = ?, maximum_number_of_student = ?
`

const deleteRoomById = `
DELETE FROM room WHERE id = ?
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
    deleteRoomById
};
