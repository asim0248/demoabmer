const express = require('express');
const router = express.Router();

const User = require('../models/user.js')
const {isLoggedIn, hasPermission} = require('../utils/middlewares.js');
const { toggleStatus } = require('../controller/commonStatusController');
const employeeController = require('../controller/employeeController.js');


//Render Employee View Page
router.get('/admin/employee', isLoggedIn, hasPermission('employee'), employeeController.renderEmployeeViewPage);

//Render Add New Employee Page
router.get('/admin/employee/add', isLoggedIn, hasPermission('employee'), employeeController.renderAddEmployeePage);

//Employee Add New Route
router.post('/admin/employee/add', isLoggedIn, hasPermission('employee'), employeeController.AddNewEmployeeRoute);

//Render Employee Edit Page
router.get('/admin/employee/:id/edit', isLoggedIn, hasPermission('employee'), employeeController.renderEditEmployeePage);

//Employee Update Route
router.put('/admin/employee/:id/edit', isLoggedIn, hasPermission('employee'), employeeController.employeeUpdateRoute);

//Employee Delete Route
router.delete('/admin/employee/:id',isLoggedIn, hasPermission('employee'), employeeController.employeeDeleteRoute);

//Status Change Route
router.post(
    '/admin/employee/:id/toggle-status',
    isLoggedIn,
    hasPermission('employee'),
    toggleStatus(User)
);
module.exports = router;