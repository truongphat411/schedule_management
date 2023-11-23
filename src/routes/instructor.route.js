const router = require('express').Router();
const { asyncHandler } = require('../middlewares/asyncHandler');
const instructorController = require('../controllers/instructor.controller');
const { authenticatateJWT } = require('../middlewares/authenticator');


router.route('/create-instructor')
    .post(asyncHandler(instructorController.create));

router.route('/instructor/:instructorId')
    .get(asyncHandler(instructorController.read));

router.route('/update-instructor/:instructorId')
    .post(asyncHandler(instructorController.update));

router.route('/delete-instructor/:instructorId')
    .get(asyncHandler(instructorController.delete));

router.route('/instructors')
    .get(asyncHandler(instructorController.readAll));

router.route('/instructors-from-timetable')
    .post(asyncHandler(instructorController.readFromTimetable));


module.exports = router;