const express = require('express');
const router = express.Router();

const { toggleStatus, toggleField } = require('../controller/commonStatusController');
const { isLoggedIn, hasPermission } = require('../utils/middlewares.js');

const reviewsController = require('../controller/reviewController.js');
const Reviews = require('../models/customer-reviews.js');

// File upload package
const multer = require('multer');
const { storage } = require('../config/CloudConfig');

// Multer configuration
const upload = multer({ storage });

const WrapAsync = require('../utils/WrapAsync');

//Render Customer Reviews Page 
router.get('/admin/customer-reviews', isLoggedIn, hasPermission('customer-reviews'), reviewsController.renderReviewPage);

//Render Add New Review Page
router.get('/admin/customer-reviews/add', isLoggedIn, hasPermission('customer-reviews'), reviewsController.renderAddNewReviewPage);

//Render Edit Review Page
router.get('/admin/customer-reviews/:id/edit', isLoggedIn, hasPermission('customer-reviews'), reviewsController.renderEditReviewPage);

//Add New Review Route
router.post('/admin/customer-reviews/add', upload.single('customerImage'), reviewsController.addNewReviewRoute);

//Update Review Route
router.put('/admin/customer-reviews/:id', isLoggedIn, hasPermission('customer-reviews'), upload.single('customerImage'), reviewsController.updateReviewRoute);

//Review Delere Route
router.delete('/admin/customer-reviews/:id', isLoggedIn, hasPermission('customer-reviews'), reviewsController.deleteReviewRoute);

//Status Change Route
router.post('/admin/customer-reviews/:id/toggle-status',
    isLoggedIn,
    hasPermission('customer-reviews'),
    toggleStatus(Reviews)
);

//Featured Route
router.post("/admin/customer-reviews/:id/toggle-featured", hasPermission('customer-reviews'), isLoggedIn, WrapAsync(async (req, res) => {
    const review = await toggleField(
        Reviews,
        req.params.id,
        "isFeatured",
        "Featured",
        "Not-Featured"
    );

    res.json({
        success: true,
        value: review.isFeatured
    });
})
);


module.exports = router;

