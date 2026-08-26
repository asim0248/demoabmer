const express = require('express');
const router = express.Router();

const { toggleStatus, toggleField } = require('../controller/commonStatusController');
const { isLoggedIn, hasPermission } = require('../utils/middlewares.js');

const serviceController = require('../controller/whatWeOfferController.js');
const Services = require('../models/what-we-offer.js');

// File upload package
const multer = require('multer');
const { storage } = require('../config/CloudConfig');

// Multer configuration
const upload = multer({ storage });

const WrapAsync = require('../utils/WrapAsync');

//Render Admin What We Offer Page
router.get('/admin/what-we-offer', isLoggedIn, hasPermission('what-we-offer'), serviceController.renderServicePage);

//Render Service Add Route
router.get('/admin/what-we-offer/add', isLoggedIn, hasPermission('what-we-offer'), serviceController.renderAddNewServicePage);

//Add New Service Route
router.post('/admin/what-we-offer/add', isLoggedIn, upload.fields([
    { name: 'serviceIcon', maxCount: 1 }, { name: 'serviceDetImg', maxCount: 1 }, { name: 'serviceCardImg', maxCount: 1 }
]), serviceController.addNewServiceRoute
);

//Render What We Offer Edit Page
router.get('/admin/what-we-offer/:id/edit', isLoggedIn, hasPermission('what-we-offer'), serviceController.renderEditServicePage);

//What we offer update Route
router.put('/admin/what-we-offer/:id',
    isLoggedIn,
    hasPermission('what-we-offer'),
    upload.fields([
        { name: 'serviceIcon', maxCount: 1 },
        { name: 'serviceDetImg', maxCount: 1 },
        { name: 'serviceCardImg', maxCount: 1 }
    ]), serviceController.serviceUpdateRoute
);

router.delete('/admin/what-we-offer/:id', isLoggedIn, hasPermission('what-we-offer'), serviceController.serviceDeleteRoute);

//Status Change Route
router.post('/admin/what-we-offer/:id/toggle-status',
    isLoggedIn,
    hasPermission('what-we-offer'),
    toggleStatus(Services)
);

//Featured Route
router.post("/admin/what-we-offer/:id/toggle-featured", hasPermission('what-we-offer'), isLoggedIn, WrapAsync(async (req, res) => {
    const sngService = await toggleField(
        Services,
        req.params.id,
        "isFeatured",
        "Featured",
        "Not-Featured"
    );

    res.json({
        success: true,
        value: sngService.isFeatured
    });
})
);

module.exports = router;