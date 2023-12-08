const router = require('express').Router();
const { asyncHandler } = require('../middlewares/asyncHandler');
const statusMailController = require('../controllers/status_mail.controller');
const { authenticatateJWT } = require('../middlewares/authenticator');


router.route('/status-mail')
    .get(asyncHandler(statusMailController.readAll));

module.exports = router;