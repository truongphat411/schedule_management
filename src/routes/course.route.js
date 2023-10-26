const router = require('express').Router();
const { asyncHandler } = require('../middlewares/asyncHandler');
const courseController = require('../controllers/course.controller');
const { authenticatateJWT } = require('../middlewares/authenticator');


router.route('/create-course')
    .post(asyncHandler(courseController.create));
    

router.route('/course/:id')
    .post(authenticatateJWT, asyncHandler(courseController.create));


router.route('/getUserById/:id').get(authenticatateJWT, asyncHandler(courseController.getUserById));


module.exports = router;