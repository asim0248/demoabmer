const express = require('express');
const router = express.Router();


//User model
const CustomCode = require('../models/custom-code.js');

const {isLoggedIn, hasPermission} = require('../utils/middlewares.js');
const customCodeController = require('../controller/customCodeController.js');

//Render Custom Code Page
router.get('/admin/custom-code', isLoggedIn, hasPermission('custom-code'), customCodeController.renderCustomCodePage);

//Update Custom Code Page
router.post('/admin/custom-code', isLoggedIn, hasPermission('custom-code'), customCodeController.updateCustomCodeRoute);

module.exports = router;