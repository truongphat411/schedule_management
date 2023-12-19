const router = require('express').Router();
const { asyncHandler } = require('../middlewares/asyncHandler');
const departmentController = require('../controllers/department.controller');


router.route('/departments')
    .get(asyncHandler(departmentController.readAll));

router.route('/departments-in-classes')
    .get(asyncHandler(departmentController.readDepartmentInClass));


module.exports = router;