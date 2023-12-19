const router = require('express').Router();
const { asyncHandler } = require('../middlewares/asyncHandler');
const meetingTimeController = require('../controllers/meeting_time.controller');


router.route('/meeting-time')
    .get(asyncHandler(meetingTimeController.readAll));

module.exports = router;