const Instructor = require('../models/instructor.model');

exports.create = (req, res) => {
    const {instructor_name} = req.body;

    const instructor = new Instructor(instructor_name);

    Instructor.create(instructor, (err, data) => {
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
    const instructorId = req.params.instructorId;

    Instructor.read(instructorId, (err, data) => {
        if(err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    status: 'error',
                    message: `Instructor not found`
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
                data
            });
            return;
        }
    })
}

exports.update = (req, res) => {
    const {instructor_name, major_id} = req.body;

    const instructor = new Instructor(instructor_name);

    Instructor.update(instructor, (err, data) => {
        if(err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    status: 'error',
                    message: `Instructor not found`
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
                message: 'Instructor updated successfully'
            });
            return;
        }
    })
}

exports.delete = (req, res) => {
    const instructorId = req.params.roomId;

    Instructor.delete(instructorId, (err, data) => {
        if (err) {
            if (err.kind === "not_found") {
                res.status(404).send({
                    status: 'error',
                    message: `InstructorId not found`
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
                message: 'InstructorId deleted successfully'
            });
        }
    })
}

exports.readAll = (req, res) => {
    const department_id = req.params.department_id
    Instructor.getInstructors(department_id, (err, data) => {
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

exports.readFromTimetable = (req, res) => {
    const {department_id , semester_id} = req.body;

    Instructor.getInstructorsFromTimetable(department_id, semester_id, (err, data) => {
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

exports.readAllInstructor = (req, res) => {

    Instructor.readAll((err, data) => {
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