const express = require('express');
const router = express.Router();

const {isLoggedIn, hasPermission} = require('../utils/middlewares.js');
const changePasswordController = require('../controller/changePasswordController.js');

// Admin Dashboard Change Password route
router.get('/admin/changepassword', isLoggedIn, hasPermission('changepassword'), changePasswordController.renderChangePassword);

//Chnagepassword Update Route
router.put('/admin/myaccount', isLoggedIn, changePasswordController.passwordUpdateRoute);

module.exports = router;