const router = require('express').Router();
const { asyncHandler } = require('../middlewares/asyncHandler');
const checkUserName = require('../middlewares/checkUserName');
const { signup: signupValidator, signin: signinValidator } = require('../validators/auth');
const courseController = require('../controllers/course.controller');
const { authenticatateJWT } = require('../middlewares/authenticator');


router.route('/create-course')
    .post(signupValidator, asyncHandler(checkUserName), asyncHandler(authController.signup));

router.route('/signin')
    .post(signinValidator, asyncHandler(authController.signin));

router.route('/getUserById/:id').get(authenticatateJWT, asyncHandler(authController.getUserById));


module.exports = router;