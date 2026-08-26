const express = require('express');
const router = express.Router();


const { toggleStatus, toggleField } = require('../controller/commonStatusController');

//FAQ model
const Faq = require('../models/faq.js');
// All Middlewares
const { isLoggedIn, hasPermission } = require('../utils/middlewares.js');
const faqController = require('../controller/faqController.js');
//Render All faq Page
router.get('/admin/faq', isLoggedIn, hasPermission('faq'), faqController.renderAllFaqPage);

//Render Add New faq Page
router.get('/admin/faq/add', isLoggedIn, hasPermission('faq'), faqController.renderAddNewfaqPage);

//Render Edit faq Page
router.get('/admin/faq/:id/edit', isLoggedIn, hasPermission('faq'), faqController.renderfaqEditPage);

//Add New faq route
router.post('/admin/faq/add', isLoggedIn, hasPermission('faq'), faqController.addNewFaqRoute);

//Faq update route
router.put('/admin/faq/:id', isLoggedIn, hasPermission('faq'), faqController.updateFaqRoute);

//Faq Delete route
router.delete('/admin/faq/:id', isLoggedIn, hasPermission('faq'), faqController.faqDeleteRoute);

//Status Change Route
router.post( '/admin/faq/:id/toggle-status',
    isLoggedIn,
    hasPermission('faq'),
    toggleStatus(Faq)
);

module.exports = router;