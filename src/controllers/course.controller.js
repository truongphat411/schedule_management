const Course = require('../models/course.model');

exports.create = (req, res) => {
    const {course_name, credits, maxNumberOfStudents, major_id} = req.body;

    const course = new Course(null,course_name, credits, maxNumberOfStudents, null);

    Course.create(course, major_id, (err, data) => {
        if (err) {
            res.status(500).send({
                status: "error",
                message: err.message
            });
        } else {    
            res.status(201).send({
                status: "success",
                data: {
                    data
                }
            });
        }
    })
}

exports.read = (req, res) => {
    const courseId = req.params.courseId;

    Course.read(courseId, (err, data) => {
        if(err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    status: 'error',
                    message: `Course was not found`
                });
                return;
            }
            res.status(500).send({
                status: 'error',
                message: err.message
            });
            return;
        }
        if(data){
            res.status(200).send({
                status: 'success',
                data: {
                    course_name: data.course_name,
                    credits: data.credits,
                    maxNumberOfStudents: data.maxNumberOfStudents,
                    major: data.major,
                }
            });
            return;
        }
    })
}

exports.update = (req, res) => {
    const {id,course_name, credits} = req.body;

    const course = new Course(id, course_name, credits, maxNumberOfStudents);

    Course.update(course, (err, data) => {
        if(err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    status: 'error',
                    message: `Course not found`
                });
                return;
            }
            res.status(500).send({
                status: 'error',
                message: err.message
            });
            return;
        }
        if (data) {
            res.status(200).send({
                status: 'success',
                message: 'Course updated successfully'
            });
            return;
        }
    })
}

exports.delete = (req, res) => {
    const courseId = req.params.courseId;

    Course.delete(courseId, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    status: 'error',
                    message: `Course not found`
                });
                return;
            }
            res.status(500).send({
                status: 'error',
                message: err.message
            });
        } else {
            res.status(200).send({
                status: 'success',
                message: 'Course deleted successfully'
            });
        }
    })
}


exports.readAllByIdDepartment = (req, res) => {
    const departmentId = req.params.departmentId;

    Course.getCoursesByDepartment(departmentId, (err, data) => {
        if (err) {
            res.status(500).send({
                status: "error",
                message: err.message
            });
        } else {    
            res.status(200).send({
                status: "success",
                data
            });
        }
    })
}