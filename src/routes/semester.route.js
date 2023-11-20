const router = require('express').Router();
const { asyncHandler } = require('../middlewares/asyncHandler');
const semesterController = require('../controllers/semester.controller');
const { authenticatateJWT } = require('../middlewares/authenticator');


router.route('/semesters')
    .get(asyncHandler(semesterController.readAll));

module.exports = router;