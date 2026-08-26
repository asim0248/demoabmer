const express = require('express');
const router = express.Router();

// File upload package
const multer = require('multer');
const { storage } = require('../config/CloudConfig');

// Multer configuration
const upload = multer({ storage });

//Hero Section model
const HeroSection = require('../models/hero-section.js');

// All Middlewares
const { isLoggedIn, hasPermission } = require('../utils/middlewares.js');

const { toggleStatus } = require('../controller/commonStatusController');

//Employe Controller
const heroSectionController = require('../controller/heroSectionController.js');

//Render Hero Section Page
router.get('/admin/hero-section', isLoggedIn, hasPermission('hero-section'), heroSectionController.renderHeroPage);

//Render Add New Slide Page
router.get('/admin/hero-section/add', isLoggedIn, hasPermission('hero-section'), heroSectionController.renderAddNewHeroPage);

//Add New Slide Route
router.post( "/admin/hero-section/add", isLoggedIn, upload.single("sldImage"), heroSectionController.addNewSlideRoute);

//Hero Section Slide Edit Page
router.get('/admin/hero-section/:id/edit', isLoggedIn, hasPermission('hero-section'), heroSectionController.renderSlideEditPage);

//Hero Section Delete Route
router.delete('/admin/hero-section/:id', isLoggedIn, hasPermission('hero-section'), heroSectionController.slideDeleteRoute);

//Hero Section Slide Update Route
router.put('/admin/hero-section/:id', isLoggedIn, hasPermission('hero-section'), upload.single('sldImage'), heroSectionController.slideUpdateRoute);

//Status Change Route
router.post(
    '/admin/hero-section/:id/toggle-status',
    isLoggedIn,
    hasPermission('hero-section'),
    toggleStatus(HeroSection)
);

module.exports = router;