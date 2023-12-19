const router = require('express').Router();
const { asyncHandler } = require('../middlewares/asyncHandler');
const courseController = require('../controllers/course.controller');
const { authenticatateJWT } = require('../middlewares/authenticator');


router.route('/create-course')
    .post(asyncHandler(courseController.create));
    

router.route('/course/:courseId')
    .get(asyncHandler(courseController.read));


router.route('/update-course/:courseId')
    .post(authenticatateJWT, asyncHandler(courseController.update));

router.route('/delete-course/:courseId')
    .post(authenticatateJWT, asyncHandler(courseController.delete));

router.route('/courses/:departmentId')
    .get(asyncHandler(courseController.readAllByIdDepartment));

router.route('/courses')
    .get(asyncHandler(courseController.readAll));


module.exports = router;