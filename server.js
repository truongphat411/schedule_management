const app = require('./app');
const { logger } = require('./src/utils/logger');
const db = require('./src/config/db.config');
const Driver = require('./src/driver');
const util = require('util');

const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
    logger.info(`Running on PORT ${PORT}`);
});


// SELECT DISTINCT
//     i.id,
//     i.instructor_name,
//     i.email,
//     i.number_phone,
//     i.gender,
//     d.department_name,
//     c.course_name,
//     s.semester_name
// FROM
//     class cl
// JOIN course c ON cl.course_id = c.id
// JOIN instructor i ON cl.instructor_id = i.id
// JOIN semester s ON c.semester_id = s.id
// JOIN department d ON cl.department_id = d.id
// WHERE
//     s.id = 1 and d.id = 1



// SELECT
// 	cl.id,
//     c.course_name,
//     i.instructor_name,
//     mt.time,
//     d.department_name,
//     s.semester_name
// FROM
//     class cl
// JOIN course c ON cl.course_id = c.id
// JOIN instructor i ON cl.instructor_id = i.id
// JOIN semester s ON c.semester_id = s.id
// JOIN department d ON cl.department_id = d.id
// JOIN meeting_time mt ON cl.meeting_time_id = mt.id
// WHERE i.id = 2




// exports.timetable = async (req, res) => {
//     const {department_id , semester_id} = req.body;
//     try {
        
//         res.status(200).json({
//             status: "success",
// 			data,
// 		});
//     } catch (err) {
//         res.status(500).json({
//             errorMessage: 'server error',
//         });
//     }
// };

// SELECT 
//     cl.id,
//     d.department_name,
//     json_object(
//         'id', c.id,
//         'course_name', c.course_name,
//         'credits', c.credits,
//         'maxNumberOfStudents', c.maxNumberOfStudents,
//         'semester', json_object(
//             'id', s.id,
//             'semester_name', s.semester_name
//         ),
//         'instructors', GROUP_CONCAT(json_object(
//             'id', i.id,
//             'instructor_name', i.instructor_name
//         ))
//     ) AS course,
//     json_object(
//         'id', i.id,
//         'instructor_name', i.instructor_name
//     ) AS instructor,
//     json_object(
//         'id', mt.id,
//         'time', mt.time
//     ) AS meetingTime,
//     json_object(
//         'id', r.id,
//         'room_name', r.room_name,
//         'capacity', r.capacity
//     ) AS room
// FROM class cl
// JOIN course c ON c.id = cl.course_id
// JOIN instructor i ON i.id = cl.instructor_id
// JOIN meeting_time mt ON mt.id = cl.meeting_time_id
// JOIN semester s ON s.id = c.semester_id
// JOIN room r ON r.id = cl.room_id
// JOIN course_instructor ci ON ci.instructor_id = i.id AND ci.course_id = c.id
// JOIN department_course dc ON dc.course_id = c.id
// JOIN department d ON dc.department_id = d.id
// WHERE d.id = 1 and s.id = 1
// GROUP BY cl.id, d.department_name;