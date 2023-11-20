const router = require('express').Router();
const { asyncHandler } = require('../middlewares/asyncHandler');
const instructorController = require('../controllers/instructor.controller');
const { authenticatateJWT } = require('../middlewares/authenticator');


router.route('/create-instructor')
    .post(authenticatateJWT, asyncHandler(instructorController.create));

router.route('/instructor/:instructorId')
    .get(authenticatateJWT, asyncHandler(instructorController.read));

router.route('/update-instructor/:instructorId')
    .post(authenticatateJWT, asyncHandler(instructorController.update));

router.route('/delete-instructor/:instructorId')
    .get(authenticatateJWT, asyncHandler(instructorController.delete));

router.route('/instructors')
    .get(asyncHandler(instructorController.readAll));

router.route('/instructors-from-timetable')
    .post(asyncHandler(instructorController.readFromTimetable));


module.exports = router;