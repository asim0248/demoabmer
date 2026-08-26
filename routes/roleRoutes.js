const express = require('express');
const router = express.Router();

// Role Sections
const sections = require('../config/adminSections');


const {isLoggedIn, hasPermission} = require('../utils/middlewares.js');
const roleController = require('../controller/roleController.js');

// Admin Role Add new route
router.get('/admin/role/add', isLoggedIn, hasPermission('role'),  roleController.renderNewRolePage);

//Admin Role view Route
router.get('/admin/role', isLoggedIn, hasPermission('role'), roleController.renderViewRolePage);

//Admin Role Delete Route
router.delete('/admin/role/:id', isLoggedIn, hasPermission('role'), roleController.renderDeleteRole);

//Admin Role Add Route
router.post('/admin/role/add', isLoggedIn, hasPermission('role'), roleController.addNewRoleRoute);

//Admin Role Edit Route 
router.get('/admin/role/:id/edit', isLoggedIn, hasPermission('role'), roleController.renderEditRolePage);

//Admin Role Update Route
router.put('/admin/role/:id/edit', isLoggedIn, hasPermission('role'), roleController.updateRoleRoute);

module.exports = router;