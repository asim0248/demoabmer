const WrapAsync = require('../utils/wrapAsync');

//Our Vehicle model
const Reviews = require('../models/customer-reviews.js');

const Cloudinary = require('cloudinary');

//Render Customer Reviews Page 
module.exports.renderReviewPage = WrapAsync(async (req, res) => {
    const allReviews = await Reviews.find().sort({ createdAt: -1 });
    res.render('admin/customer-reviews/view', { allReviews })
});

//Render Add New Review Page
module.exports.renderAddNewReviewPage = (req, res) => {
    res.render('admin/customer-reviews/add')
};

//Render Edit Review Page
module.exports.renderEditReviewPage = WrapAsync(async (req, res) => {
    let editReview = await Reviews.findById(req.params.id);

    if (!editReview) {
        req.flash('error', 'Review not found');
        return res.redirect('/admin/customer-reviews');
    }
    res.render('admin/customer-reviews/edit', { editReview })
});

//Add New Review Route
module.exports.addNewReviewRoute = WrapAsync(async (req, res) => {

    if (!req.body.customerName?.trim()) {
        req.flash("error", "Customer Name is required");
        return res.redirect("/admin/customer-reviews/add");
    }

    if (!req.body.location?.trim()) {
        req.flash("error", "Location is required");
        return res.redirect("/admin/customer-reviews/add");
    }

    if (!req.body.reviewText?.trim()) {
        req.flash("error", "Review Text is required");
        return res.redirect("/admin/customer-reviews/add");
    }

    if (!req.body.rating) {
        req.flash("error", "Rating is required");
        return res.redirect("/admin/customer-reviews/add");
    }

    if (!req.file) {
        req.flash("error", "Customer Image is required");
        return res.redirect("/admin/customer-reviews/add");
    }


    const newReview = new Reviews({
        customerName: req.body.customerName?.trim(),
        location: req.body.location?.trim(),
        reviewText: req.body.reviewText?.trim(),
        rating: Number(req.body.rating),
        sortOrder: req.body.sortOrder
            ? Number(req.body.sortOrder)
            : 0,
        customerImage: {
            url: req.file.path,
            filename: req.file.filename
        }
    });

    await newReview.save();

    req.flash("success", "Review Added Successfully");
    res.redirect("/admin/customer-reviews");
});

//Update Review Route
module.exports.updateReviewRoute = WrapAsync(async (req, res) => {

    const updateReview = await Reviews.findById(req.params.id);

    if (!updateReview) {
        req.flash('error', 'Review not found');
        return res.redirect('/admin/customer-reviews');
    }

    if (!req.body.customerName?.trim()) {
        req.flash("error", "Customer Name is required");
        return res.redirect(`/admin/customer-reviews/${req.params.id}/edit`);
    }

    if (!req.body.location?.trim()) {
        req.flash("error", "Location is required");
        return res.redirect(`/admin/customer-reviews/${req.params.id}/edit`);
    }

    if (!req.body.reviewText?.trim()) {
        req.flash("error", "Review Text is required");
        return res.redirect(`/admin/customer-reviews/${req.params.id}/edit`);
    }

    if (!req.body.rating) {
        req.flash("error", "Rating is required");
        return res.redirect(`/admin/customer-reviews/${req.params.id}/edit`);
    }

    updateReview.customerName = req.body.customerName?.trim();
    updateReview.location = req.body.location?.trim();
    updateReview.reviewText = req.body.reviewText?.trim();
    updateReview.rating = Number(req.body.rating);

    updateReview.sortOrder = req.body.sortOrder
        ? Number(req.body.sortOrder)
        : 0;

    if (req.file) {

        if (updateReview.customerImage?.filename) {
            await Cloudinary.uploader.destroy(
                updateReview.customerImage.filename
            );
        }

        updateReview.customerImage = {
            url: req.file.path,
            filename: req.file.filename
        };
    }

    await updateReview.save();

    req.flash(
        'success',
        'Review Updated Successfully'
    );

    res.redirect('/admin/customer-reviews');
});

module.exports.deleteReviewRoute =WrapAsync(async (req, res) => {

    const deleteReview = await Reviews.findById(req.params.id);

    if (!deleteReview) {
        req.flash('error', 'Review not found');
        return res.redirect('/admin/customer-reviews');
    }

    // Delete image from Cloudinary
    if (deleteReview.customerImage?.filename) {
        await Cloudinary.uploader.destroy(
            deleteReview.customerImage.filename
        );
    }

    // Delete record from database
    await deleteReview.deleteOne();

    req.flash(
        'success',
        'Review Deleted Successfully'
    );

    res.redirect('/admin/customer-reviews');
})