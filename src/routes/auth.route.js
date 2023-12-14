const router = require('express').Router();
const { asyncHandler } = require('../middlewares/asyncHandler');
const authController = require('../controllers/auth.controller');


router.route('/signup')
    .post(asyncHandler(authController.signup));

router.route('/signin')
    .post(asyncHandler(authController.signin));

module.exports = router;