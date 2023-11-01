const router = require('express').Router();
const { asyncHandler } = require('../middlewares/asyncHandler');
const departmentController = require('../controllers/department.controller');


router.route('/departments')
    .get(asyncHandler(departmentController.readAll));


module.exports = router;