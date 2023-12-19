const router = require('express').Router();
const { asyncHandler } = require('../middlewares/asyncHandler');
const GroupStudentsController = require('../controllers/group_students.controller');


router.route('/group-students')
    .get(asyncHandler(GroupStudentsController.readAll));

module.exports = router;