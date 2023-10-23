const router = require('express').Router();
const { asyncHandler } = require('../middlewares/asyncHandler');
const instructorController = require('../controllers/instructor.controller');
const { authenticatateJWT } = require('../middlewares/authenticator');


router.route('/create-instructor')
    .post(authenticatateJWT, asyncHandler(instructorController.create));

router.route('/:instructorId')
    .get(authenticatateJWT, asyncHandler(instructorController.read));

router.route('/update-instructor')
    .post(authenticatateJWT, asyncHandler(instructorController.update));

router.route('/delete-instructor/:instructorId')
    .get(authenticatateJWT, asyncHandler(instructorController.delete));


module.exports = router;