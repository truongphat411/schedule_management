const Course = require('../models/course.model');

exports.create = (req, res) => {
    const {course_name, credits} = req.body;

    const course = new Course(course_name, credits);

    Course.create(course, (err, data) => {
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
                }
            });
            return;
        }
    })
}

exports.update = (req, res) => {
    const {course_name, credits} = req.body;

    const course = new Course(course_name, credits);

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