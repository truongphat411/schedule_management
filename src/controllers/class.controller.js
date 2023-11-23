const Data = require("../data");
const Driver = require("../driver");


exports.timetable_generator = async (req, res) => {
    const {department_id , semester_id} = req.body;
    try {
        const driver = new Driver();
        const data = await driver.main(department_id,semester_id);
        res.status(200).json({
            status: "success",
			data,
		});
    } catch (err) {
        res.status(500).json({
            errorMessage: 'server error',
        });
    }
};

exports.timetable = async (req, res) => {
    const {department_id , semester_id} = req.body;
    try {
        const result = new Data();
        const data = await result.getClass(department_id, semester_id);
        res.status(200).json({
            status: "success",
			data,
		});
    } catch (err) {
        res.status(500).json({
            errorMessage: 'server error',
        });
    }
};

exports.timetableById = async (req, res) => {
    const class_id = req.params.classId;
    try {
        const result = new Data();
        const data = await result.getClassById(class_id);
        res.status(200).json({
            status: "success",
			data,
		});
    } catch (err) {
        res.status(500).json({
            errorMessage: 'server error',
        });
    }
};