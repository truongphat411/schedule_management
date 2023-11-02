const router = require('express').Router();
const { asyncHandler } = require('../middlewares/asyncHandler');
const classController = require('../controllers/class.controller');
const { authenticatateJWT } = require('../middlewares/authenticator');


router.route('/timetable-generator')
    .get(asyncHandler(classController.timetable_generator));
    
module.exports = router;