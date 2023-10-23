const router = require('express').Router();
const { asyncHandler } = require('../middlewares/asyncHandler');
const roomController = require('../controllers/room.controller');
const { authenticatateJWT } = require('../middlewares/authenticator');


router.route('/create-room')
    .post(authenticatateJWT, asyncHandler(roomController.create));

router.route('/')
    .get(authenticatateJWT, asyncHandler(roomController.read));

router.route('/update-room')
    .post(authenticatateJWT, asyncHandler(roomController.update));

router.route('/delete-room/:roomId')
    .get(authenticatateJWT, asyncHandler(roomController.delete));

module.exports = router;