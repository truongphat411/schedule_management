const router = require('express').Router();
const { asyncHandler } = require('../middlewares/asyncHandler');
const areaController = require('../controllers/area.controller');


router.route('/areas')
    .get(asyncHandler(areaController.readAll));

module.exports = router;