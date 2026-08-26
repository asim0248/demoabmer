//WrapAsync
const WrapAsync = require('../utils/WrapAsync');

//Hero Section model
const HeroSection = require('../models/hero-section.js');

//Common Status Controller
const { toggleStatus } = require('./commonStatusController.js');


const Cloudinary = require('cloudinary');

//Render Hero Section Page
module.exports.renderHeroPage = WrapAsync(async (req, res) => {
    let heroSection = await HeroSection.find().sort({ createdAt: -1 });
    res.render('admin/hero-section/view.ejs', { heroSection });
});

//Render Add New Slide Page
module.exports.renderAddNewHeroPage = WrapAsync(async (req, res) => {

    res.render('admin/hero-section/add.ejs');
});

//Add New Slide Route
module.exports.addNewSlideRoute = WrapAsync(async (req, res) => {

    const {
        tagLine,
        heading,
        paraText,
        buttonText,
        buttonLink,
        sortOrder
    } = req.body;

    if (!tagLine) {
        req.flash('error', 'Tag Line is required');
        return res.redirect('/admin/hero-section/add');
    }

    if (!heading) {
        req.flash('error', 'Heading is required');
        return res.redirect('/admin/hero-section/add');
    }

    if (!paraText) {
        req.flash('error', 'Para Text is required');
        return res.redirect('/admin/hero-section/add');
    }

    if (!req.file) {
        req.flash("error", "Banner Image is required");
        return res.redirect("/admin/hero-section/add");
    }

    const heroSection = new HeroSection({
        tagLine: req.body.tagLine?.trim(),
        heading: req.body.heading?.trim(),
        paraText: req.body.paraText?.trim(),
        buttonText: req.body.buttonText?.trim(),
        buttonLink: req.body.buttonLink?.trim(),
        sortOrder: Number(req.body.sortOrder) || 1,
        sldImage: {
            url: req.file.path,
            filename: req.file.filename
        }
    });

    await heroSection.save();

    req.flash("success", "Hero Section Added Successfully");
    res.redirect("/admin/hero-section");
});

//Render Hero Section Slide Edit Page
module.exports.renderSlideEditPage = WrapAsync(async (req, res) => {
    let heroSection = await HeroSection.findById(req.params.id);

    if (!heroSection) {
        req.flash('error', 'Hero Section not found');
        return res.redirect('/admin/hero-section');
    }

    res.render('admin/hero-section/edit.ejs', { heroSection });
});

//Hero Section Delete Route
module.exports.slideDeleteRoute = WrapAsync(async (req, res) => {

    const heroSection = await HeroSection.findById(req.params.id);

    if (!heroSection) {
        req.flash('error', 'Hero Section not found');
        return res.redirect('/admin/hero-section');
    }

    // Delete image from Cloudinary
    if (heroSection.sldImage?.filename) {
        await Cloudinary.uploader.destroy(
            heroSection.sldImage.filename
        );
    }

    // Delete record from database
    await HeroSection.findByIdAndDelete(req.params.id);

    req.flash(
        'success',
        'Hero Section Deleted Successfully'
    );

    res.redirect('/admin/hero-section');
});

module.exports.slideUpdateRoute = WrapAsync(async (req, res) => {

    const {
        tagLine,
        heading,
        paraText,
        buttonText,
        buttonLink,
        sortOrder
    } = req.body;

    const heroSection = await HeroSection.findById(req.params.id);

    if (!heroSection) {
        req.flash('error', 'Hero Section not found');
        return res.redirect('/admin/hero-section');
    }

    let errors = [];

    if (!tagLine?.trim()) {
        errors.push('Tag Line is required');
    }

    if (!heading?.trim()) {
        errors.push('Heading is required');
    }

    if (!paraText?.trim()) {
        errors.push('Paragraph Text is required');
    }

    if (errors.length > 0) {
        req.flash('error', errors.join('<br>'));
        return res.redirect(`/admin/hero-section/${req.params.id}/edit`);
    }

    heroSection.tagLine = tagLine.trim();
    heroSection.heading = heading.trim();
    heroSection.paraText = paraText.trim();
    heroSection.buttonText = buttonText?.trim();
    heroSection.buttonLink = buttonLink?.trim();
    heroSection.sortOrder = Number(sortOrder) || 1;

    if (req.file) {

        if (heroSection.sldImage?.filename) {
            await Cloudinary.uploader.destroy(
                heroSection.sldImage.filename
            );
        }

        heroSection.sldImage = {
            url: req.file.path,
            filename: req.file.filename
        };
    }

    await heroSection.save();

    req.flash(
        'success',
        'Hero Section Updated Successfully'
    );

    res.redirect('/admin/hero-section');
});