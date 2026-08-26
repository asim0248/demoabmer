const express = require('express');
const router = express.Router();


// All Middlewares
const { isLoggedIn, hasPermission } = require('../utils/middlewares.js');
const newsletterController = require('../controller/newsletterController.js');

//Render Admin Newsletter Page
router.get('/admin/newsletter', isLoggedIn, hasPermission('newsletter'), newsletterController.renderNewsletterPage);

//Catch Newsletter Email Route 
router.post('/newsletter', newsletterController.catchEmailRoute);

//Newsletter Email Delete Route
router.delete('/admin/newsletter/:id', isLoggedIn, hasPermission('newsletter'), newsletterController.newsletterEmailDeleteRoute);

//Export CSV Route
router.get('/admin/newsletter/export-csv', isLoggedIn, hasPermission('newsletter'), newsletterController.exportCsvRoute);

module.exports = router;