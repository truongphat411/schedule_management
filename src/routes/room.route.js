const router = require('express').Router();
const { asyncHandler } = require('../middlewares/asyncHandler');
const roomController = require('../controllers/room.controller');
const { authenticatateJWT } = require('../middlewares/authenticator');


router.route('/create-room')
    .post(authenticatateJWT, asyncHandler(roomController.create));

router.route('/room/:roomId')
    .get(authenticatateJWT, asyncHandler(roomController.read));

router.route('/update-room/:roomId')
    .post(authenticatateJWT, asyncHandler(roomController.update));

router.route('/delete-room/:roomId')
    .get(authenticatateJWT, asyncHandler(roomController.delete));

router.route('/rooms')
    .get(asyncHandler(roomController.readAll));

module.exports = router;