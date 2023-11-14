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