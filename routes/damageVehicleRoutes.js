const express = require('express');
const router = express.Router();

//Our Vehicle model
const DamageVehicle = require('../models/damage-vehicle.js');


const Cloudinary = require('cloudinary');

// File upload package
const multer = require('multer');
const { storage } = require('../config/CloudConfig');

const WrapAsync = require('../utils/WrapAsync');

// Multer configuration
const upload = multer({ storage });

// All Middlewares
const { isLoggedIn, hasPermission } = require('../utils/middlewares.js');

const { toggleStatus, toggleField } = require('../controller/commonStatusController');

//Damage Vehicle Controller
const damageVehicleController = require('../controller/damageVhicleController.js');


//Render Damage vehicle Page
router.get('/admin/damage-vehicle', isLoggedIn, hasPermission('damage-vehicle'), damageVehicleController.renderdamageVehiclePage);

// Render Add New Damage vehicle 
router.get('/admin/damage-vehicle/add', isLoggedIn, hasPermission('damage-vehicle'), damageVehicleController.renderAddDamageVehiclePage);

//Add New Damage vehicle Route
router.post( "/admin/damage-vehicle/add", isLoggedIn, upload.single("dmgImage"), damageVehicleController.addNewdamageVehicleRoute);

//Render Damage vehicle Update Route
router.get('/admin/damage-vehicle/:id/edit', isLoggedIn, hasPermission('damage-vehicle'), damageVehicleController.renderdamageVehicleEditPage);

//Damage vehicle Update Route
router.put('/admin/damage-vehicle/:id', isLoggedIn, hasPermission('damage-vehicle'), upload.single('dmgImage'), damageVehicleController.damageVehicleUpdateRoute);

// Damage vehicle Delete Route
router.delete('/admin/damage-vehicle/:id', isLoggedIn, hasPermission('damage-vehicle'), damageVehicleController.damageVehicleDeleteRoute);

//Status Change Route
router.post( '/admin/damage-vehicle/:id/toggle-status',
    isLoggedIn,
    hasPermission('damage-vehicle'),
    toggleStatus(DamageVehicle)
);

//Featured Route
router.post( "/admin/damage-vehicle/:id/toggle-featured", hasPermission('damage-vehicle'), isLoggedIn, WrapAsync(async (req, res) => {
        const dmgvehicle = await toggleField(
            DamageVehicle,
            req.params.id,
            "isFeatured",
            "Featured",
            "Not-Featured"
        );

        res.json({
            success: true,
            value: dmgvehicle.isFeatured
        });
    })
);

module.exports = router;