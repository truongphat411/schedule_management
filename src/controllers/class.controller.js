const Driver = require("../driver");


exports.timetable_generator = async (req, res) => {
    try {
        const driver = new Driver();
        const data = await driver.main();
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