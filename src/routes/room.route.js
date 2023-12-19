const router = require('express').Router();
const { asyncHandler } = require('../middlewares/asyncHandler');
const roomController = require('../controllers/room.controller');
const { authenticatateJWT } = require('../middlewares/authenticator');


router.route('/create-room')
    .post(asyncHandler(roomController.create));

router.route('/room/:roomId')
    .get(asyncHandler(roomController.read));

router.route('/update-room/:roomId')
    .post(asyncHandler(roomController.update));

router.route('/delete-room/:roomId')
    .get(asyncHandler(roomController.delete));

router.route('/rooms')
    .get(asyncHandler(roomController.readAll));

router.route('/roomss')
    .get(asyncHandler(roomController.readAllRooms));

module.exports = router;