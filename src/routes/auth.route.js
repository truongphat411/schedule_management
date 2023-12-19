const router = require('express').Router();
const { asyncHandler } = require('../middlewares/asyncHandler');
const authController = require('../controllers/auth.controller');


router.route('/signup')
    .post(asyncHandler(authController.signup));

router.route('/signin')
    .post(asyncHandler(authController.signin));

router.route('/account/:account_id')
    .get(asyncHandler(authController.read));

router.route('/accounts')
    .get(asyncHandler(authController.readAll));
router.route('/account-type')
    .get(asyncHandler(authController.readAllAccountType));

module.exports = router;