const express = require('express');
const router = express.Router();

const {isLoggedIn, hasPermission} = require('../utils/middlewares.js');
const settingController = require('../controller/settingController.js');

// File upload package
const multer = require('multer');
const { storage } = require('../config/CloudConfig');

// Multer configuration
const upload = multer({ storage });

// Admin Dashboard Settings route
router.get('/admin/setting', isLoggedIn, hasPermission('setting'), settingController.rendersettingPage);

//Seting Update Route
router.post(
    '/admin/setting',
    isLoggedIn,
    upload.fields([
        { name: 'websitelogo', maxCount: 1 },
        { name: 'websitewhitelogo', maxCount: 1 },
        { name: 'adminlogo', maxCount: 1 },
        { name: 'websitefavicon', maxCount: 1 },
        { name: 'websiteadminfavicon', maxCount: 1 }
    ]),
    settingController.updatesettingPage
);

module.exports = router;