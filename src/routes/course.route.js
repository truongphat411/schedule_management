const router = require('express').Router();
const { asyncHandler } = require('../middlewares/asyncHandler');
const courseController = require('../controllers/course.controller');
const { authenticatateJWT } = require('../middlewares/authenticator');


router.route('/create-course')
    .post(authenticatateJWT, asyncHandler(courseController.create));

router.route('/:courseId')
    .get(authenticatateJWT, asyncHandler(courseController.read));

router.route('/update-course')
    .post(authenticatateJWT, asyncHandler(courseController.update));

router.route('/delete-course/:courseId')
    .get(authenticatateJWT, asyncHandler(courseController.delete));


module.exports = router;