const router = require('express').Router();
const { asyncHandler } = require('../middlewares/asyncHandler');
const classController = require('../controllers/class.controller');


router.route('/timetable-generator')
    .post(asyncHandler(classController.timetable_generator));

// router.route('/timetable')
//     .post(asyncHandler(classController.timetable_generator));
    
module.exports = router;