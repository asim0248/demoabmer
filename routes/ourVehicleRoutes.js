const express = require('express');
const router = express.Router();

//Our Vehicle model
const OurVehicle = require('../models/our-vehicle.js');

// File upload package
const multer = require('multer');
const { storage } = require('../config/CloudConfig');

const WrapAsync = require('../utils/WrapAsync');

// Multer configuration
const upload = multer({ storage });

// All Middlewares
const { isLoggedIn, hasPermission } = require('../utils/middlewares.js');

const { toggleStatus, toggleField } = require('../controller/commonStatusController');

//Our Vehicle Controller
const ourVehicleController = require('../controller/ourVehicleController.js');

//Render Our vehicle Page
router.get('/admin/our-vehicle', isLoggedIn, hasPermission('our-vehicle'), ourVehicleController.renderOurVehiclePage);

// Render Add New Vehicle
router.get('/admin/our-vehicle/add', isLoggedIn, hasPermission('our-vehicle'), ourVehicleController.renderAddNewVehiclePage);

//Add New Vehicle Route
router.post( "/admin/our-vehicle/add", isLoggedIn, upload.single("vehicleImage"), ourVehicleController.addNewVehicleRoute);

//Render Our vehicle Update Route
router.get('/admin/our-vehicle/:id/edit', isLoggedIn, hasPermission('our-vehicle'),  ourVehicleController.renderOurVehicleEditPage);

//Our Vehicle Update Route
router.put('/admin/our-vehicle/:id', isLoggedIn, hasPermission('our-vehicle'), upload.single('vehicleImage'), ourVehicleController.ourVehicleUpdateRoute);

router.delete('/admin/our-vehicle/:id', isLoggedIn, hasPermission('our-vehicle'), ourVehicleController.OurVehicleDeleteRoute);

//Status Change Route
router.post(
    '/admin/our-vehicle/:id/toggle-status',
    isLoggedIn,
    hasPermission('our-vehicle'),
    toggleStatus(OurVehicle)
);

//Featured Route
router.post(
    "/admin/our-vehicle/:id/toggle-featured",
    isLoggedIn,
    WrapAsync(async (req, res) => {

        const vehicle = await toggleField(
            OurVehicle,
            req.params.id,
            "isFeatured",
            "Featured",
            "Not-Featured"
        );

        res.json({
            success: true,
            value: vehicle.isFeatured
        });
    })
);

module.exports = router;