const router = require('express').Router();
const { asyncHandler } = require('../middlewares/asyncHandler');
const kindOfRoomController = require('../controllers/kind_of_room.controller');


router.route('/kind_of_rooms')
    .get(asyncHandler(kindOfRoomController.readAll));

module.exports = router;