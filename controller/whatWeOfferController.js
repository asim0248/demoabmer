const slugify = require('slugify');

const WrapAsync = require('../utils/WrapAsync');

//Our Vehicle model
const Services = require('../models/what-we-offer.js');

const Cloudinary = require('cloudinary');

//Render Admin What We Offer Page
module.exports.renderServicePage = WrapAsync(async (req, res) => {
    const allServices = await Services.find().sort({ createdAt: -1 });
    res.render('admin/what-we-offer/view', { allServices });
});

//Render Service Add Route
module.exports.renderAddNewServicePage = (req, res) => {
    res.locals.pageScript = 'what-we-offer';
    res.render('admin/what-we-offer/add');
};

//Render What We Offer Edit Page
module.exports.renderEditServicePage = WrapAsync(async (req, res) => {
    const singleService = await Services.findById(req.params.id);
    res.locals.pageScript = 'what-we-offer';
    res.render('admin/what-we-offer/edit', { singleService });
});

//Add New Service Route
module.exports.addNewServiceRoute = WrapAsync(async (req, res) => {

    const {
        title,
        slug,
        sortOrder,
        shortContent,
        metaTitle,
        metaKeywords,
        metaDescription,
        detailContent
    } = req.body;

    // Required field validations
    if (!title?.trim()) {
        req.flash('error', 'Service Title is required');
        return res.redirect('/admin/what-we-offer/add');
    }

    if (!slug?.trim()) {
        req.flash('error', 'Service Slug is required');
        return res.redirect('/admin/what-we-offer/add');
    }

    // Image validations
    if (!req.files?.serviceIcon?.length) {
        req.flash('error', 'Service Icon is required');
        return res.redirect('/admin/what-we-offer/add');
    }

    if (!req.files?.serviceCardImg?.length) {
        req.flash('error', 'Service Card Image is required');
        return res.redirect('/admin/what-we-offer/add');
    }

    const existingSlug = await Services.findOne({
        slug: slug.trim()
    });

    if (existingSlug) {
        req.flash('error', 'Slug already exists');
        return res.redirect('/admin/what-we-offer/add');
    }

    const newService = new Services({
        title: title.trim(),
        slug: slug.trim(),
        sortOrder: sortOrder ? Number(sortOrder) : 0,
        shortContent,
        metaTitle,
        metaKeywords,
        metaDescription,
        detailContent
    });

    // Service Icon
    newService.serviceIcon = {
        url: req.files.serviceIcon[0].path,
        filename: req.files.serviceIcon[0].filename
    };

    // Detail Image
    if (req.files?.serviceDetImg?.length) {
    newService.serviceDetImg = {
        url: req.files.serviceDetImg[0].path,
        filename: req.files.serviceDetImg[0].filename
    };
}

    // Service Card Image
    newService.serviceCardImg = {
        url: req.files.serviceCardImg[0].path,
        filename: req.files.serviceCardImg[0].filename
    };

    await newService.save();

    req.flash('success', 'Service added successfully');
    res.redirect('/admin/what-we-offer');
});

//What we offer update Route
module.exports.serviceUpdateRoute = WrapAsync(async (req, res) => {
    const updateService = await Services.findById(req.params.id);
    if (!updateService) {
        req.flash('error', 'Service Not Found');
        return res.redirect('/admin/what-we-offer');
    }
    if (!req.body.title?.trim()) {
        req.flash("error", "Service Title is required");
        return res.redirect(`/admin/what-we-offer/${req.params.id}/edit`);
    }
    if (!req.body.slug?.trim()) {
        req.flash("error", "Service Slug is required");
        return res.redirect(`/admin/what-we-offer/${req.params.id}/edit`);
    }

    updateService.title = req.body.title?.trim();
    updateService.slug = req.body.slug?.trim();
    updateService.shortContent = req.body.shortContent?.trim();
    updateService.metaTitle = req.body.metaTitle?.trim();
    updateService.metaDescription = req.body.metaDescription?.trim();
    updateService.metaKeywords = req.body.metaKeywords?.trim();
    updateService.detailContent = req.body.detailContent?.trim();
    updateService.sortOrder = req.body.sortOrder ? Number(req.body.sortOrder) : 0;

    if (req.files?.serviceIcon?.[0]) {

        if (updateService.serviceIcon?.filename) {
            await Cloudinary.uploader.destroy(
                updateService.serviceIcon.filename
            );
        }

        updateService.serviceIcon = {
            url: req.files.serviceIcon[0].path,
            filename: req.files.serviceIcon[0].filename
        };
    }
    if (req.files?.serviceDetImg?.[0]) {
        if (updateService.serviceDetImg?.filename) {
            await Cloudinary.uploader.destroy(
                updateService.serviceDetImg.filename
            );
        }

        updateService.serviceDetImg = {
            url: req.files.serviceDetImg[0].path,
            filename: req.files.serviceDetImg[0].filename
        };
    }

    if (req.files?.serviceCardImg?.[0]) {
        if (updateService.serviceCardImg?.filename) {
            await Cloudinary.uploader.destroy(
                updateService.serviceCardImg.filename
            );
        }

        updateService.serviceCardImg = {
            url: req.files.serviceCardImg[0].path,
            filename: req.files.serviceCardImg[0].filename
        };
    }

    await updateService.save();
    req.flash(
        'success',
        'Service Updated Successfully'
    );


    res.redirect('/admin/what-we-offer');
});

module.exports.serviceDeleteRoute = WrapAsync(async (req, res) => {
    const deleteService = await Services.findById(req.params.id);
    if (!deleteService) {
        req.flash('error', 'Service Not Found');
        return res.redirect('/admin/what-we-offer');
    }
    if (deleteService.serviceIcon?.filename) {
        await Cloudinary.uploader.destroy(deleteService.serviceIcon.filename)
    }
    if (deleteService.serviceDetImg?.filename) {
        await Cloudinary.uploader.destroy(deleteService.serviceDetImg.filename)
    }
    if (deleteService.serviceCardImg?.filename) {
        await Cloudinary.uploader.destroy(deleteService.serviceCardImg.filename)
    }
    await deleteService.deleteOne();

    req.flash('success', 'Service Deleted Successfully');

    res.redirect('/admin/what-we-offer');
})
