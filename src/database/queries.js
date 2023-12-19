const { DB_NAME } = require('../utils/secrets')

const createDB = `CREATE DATABASE IF NOT EXISTS ${DB_NAME}`;

const dropDB = `DROP DATABASE IF EXISTS ${DB_NAME}`;

const createTableUSers = `
CREATE TABLE IF NOT EXISTS users (
    id INT PRIMARY KEY AUTO_INCREMENT,
    first_name VARCHAR(50) NULL,
    last_name VARCHAR(50) NULL,
    email VARCHAR(255) NOT NULL,
    password VARCHAR(255) NOT NULL,
    created_on TIMESTAMP(6) NOT NULL DEFAULT CURRENT_TIMESTAMP(6)
)
`;

const createNewAccount = `
INSERT INTO account VALUES(null, ?, ?, ?, ?, ?,NOW(),?)
`;

const findAccountByUserName = `
SELECT 
a.id,
a.email,
a.full_name,
a.user_name,
a.password,
a.department_id,
json_object(
        'id', at.id,
        'type_name', at.type_name
        ) AS type 
FROM Account a
JOIN AccountType at ON at.id = a.type_id
WHERE a.user_name = ?
GROUP BY a.id, a.email, a.full_name, a.user_name, a.department_id
`;

const createNewCourse = `
INSERT INTO course VALUES(null, ?, ?, ?)
`;

const findCourseById = `
SELECT
c.id, 
c.course_name,
c.credits,
GROUP_CONCAT(json_object(
        'id', d.id,
        'department_name', d.department_name
        )) AS department
FROM course c
JOIN department d ON d.id = c.department_id
WHERE c.id = ?
GROUP BY c.id, c.course_name, c.credits
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
SELECT 
i.id,
i.instructor_name,
i.email,
i.number_phone,
i.gender,
GROUP_CONCAT(json_object(
        'id', d.id,
        'department_name', d.department_name
        )) AS department 
FROM instructor i
JOIN department d ON d.id = i.department_id
WHERE i.id = ?
GROUP BY i.id, i.instructor_name, i.email, i.number_phone, i.gender
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
        )) AS area
        FROM room r
		JOIN area a ON r.area_id = a.id
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
        )) AS area
        FROM room r
		JOIN area a ON r.area_id = a.id
        group by r.id,r.room_name,r.capacity
`;

const getAllRooms = `
SELECT * FROM room
`

const getCoursesByDepartment = `
SELECT
c.id, 
c.course_name,
c.credits,
GROUP_CONCAT(json_object(
        'id', d.id,
        'department_name', d.department_name
        )) AS department
FROM course c
JOIN department d ON d.id = c.department_id
WHERE c.department_id = ?
GROUP BY c.id, c.course_name, c.credits
`

const createNewCourseInstructor = `
INSERT INTO course_instructor VALUES(null, ?, ?)
`

const getDepartment = `
SELECT * FROM department
`

const getInstructorsFromTimeTable = `
SELECT 
i.id,
i.instructor_name,
i.email,
i.number_phone,
i.gender,
d.department_name,
c.course_name
FROM class cl, course_instructor ci
JOIN course c ON ci.course_id = c.id
JOIN instructor i ON ci.instructor_id = i.id
JOIN department d ON d.id = i.department_id
JOIN semester s ON s.id = c.semester_id
WHERE d.id = ? AND s.id = ? AND cl.instructor_id = i.id AND cl.semester_id = s.id AND cl.department_id = d.id
GROUP BY i.id, i.instructor_name, i.email, i.number_phone, d.department_name, c.course_name
`

const getInstructorsByDepartmentID = `
SELECT 
i.id,
i.instructor_name,
i.email,
i.number_phone,
i.gender,
d.department_name,
c.course_name
FROM instructor_course ic
JOIN course c ON ic.course_id = c.id
JOIN instructor i ON ic.instructor_id = i.id
JOIN department d ON d.id = i.department_id
where d.id = ?
GROUP BY i.id, i.instructor_name, i.email, i.number_phone, c.course_name, d.department_name
`

const getSemesters = `
SELECT * FROM semester
`
const getCourses = `
SELECT * FROM course
`
const getGroupStudents = `
SELECT * FROM group_students
`

const getInstructors = `
SELECT * FROM instructor
`


const getMeetingTime = `
SELECT * FROM meeting_time
`

const getStatusMail = `
SELECT * FROM status_mail 
`



const getAllAccount = `
SELECT
a.id, 
a.full_name,
a.user_name,
a.email,
GROUP_CONCAT(json_object(
        'id', at.id,
        'type_name', at.type_name
        )) AS type
FROM account a
JOIN accounttype at ON at.id = a.type_id
GROUP BY a.id, a.full_name, a.user_name, a.email
`

const findAccountById = `
SELECT 
a.id,
a.email,
a.full_name,
a.user_name,
a.password,
json_object(
        'id', at.id,
        'type_name', at.type_name
        ) AS type 
FROM Account a
JOIN AccountType at ON at.id = a.type_id
WHERE a.id = ?
GROUP BY a.id, a.email, a.full_name, a.user_name
`;

const getAccountType = `
SELECT * FROM accounttype
`;

const getDepartmentInClass = `
SELECT d.id, d.department_name 
FROM department d, class c where d.id = c.department_id 
GROUP BY  d.id, d.department_name
`

module.exports = {
    createDB,
    dropDB,
    createTableUSers,
    createNewAccount,
    findAccountByUserName,
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
    getInstructorsByDepartmentID,
    getSemesters,
    getInstructorsFromTimeTable,
    getStatusMail,
    getAllAccount,
    findAccountById,
    getAccountType,
    getCourses,
    getGroupStudents,
    getMeetingTime,
    getInstructors,
    getAllRooms,
    getDepartmentInClass
};
