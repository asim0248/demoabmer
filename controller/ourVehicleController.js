const WrapAsync = require('../utils/WrapAsync');

//Our Vehicle model
const OurVehicle = require('../models/our-vehicle.js');

const Cloudinary = require('cloudinary');

//Render Our vehicle Page
module.exports.renderOurVehiclePage = WrapAsync(async(req, res) => {
    const ourVehicle = await OurVehicle.find().sort({ createdAt: -1 });
    res.render('admin/our-vehicle/view', {ourVehicle});
});

// Render Add New Vehicle
module.exports.renderAddNewVehiclePage = WrapAsync(async(req, res) => {
    res.render('admin/our-vehicle/add');
});

//Add New Vehicle Route
module.exports.addNewVehicleRoute = WrapAsync(async (req, res) => {
    if (!req.file) {
        req.flash("error", "Vehicle Image is required");
        return res.redirect("back");
    }

    const ourVehicle = new OurVehicle({
        altText: req.body.altText?.trim(),
        sortOrder: req.body.sortOrder
                ? Number(req.body.sortOrder)
                : 0,
        vehicleImage: {
            url: req.file.path,
            filename: req.file.filename
        }
    });

    await ourVehicle.save();

    req.flash("success", "Vehicle Added Successfully");
    res.redirect("/admin/our-vehicle");
});

//Our Vehicle Update Route
module.exports.renderOurVehicleEditPage = WrapAsync(async(req, res) => {
        let vehicle = await OurVehicle.findById(req.params.id);
    
        if (!vehicle) {
            req.flash('error', 'Vehicle not found');
            return res.redirect('/admin/our-vehicle');
        }
    res.render('admin/our-vehicle/edit', {vehicle});
});

//Our Vehicle Update Route
module.exports.ourVehicleUpdateRoute = WrapAsync(async (req, res) => {

        const updVehicle = await OurVehicle.findById(req.params.id);

        if (!updVehicle) {
            req.flash('error', 'Vehicle not found');
            return res.redirect('/admin/our-vehicle');
        }

        updVehicle.altText = req.body.altText?.trim();

        updVehicle.sortOrder = req.body.sortOrder
            ? Number(req.body.sortOrder)
            : 0;

        if (req.file) {

            if (updVehicle.vehicleImage?.filename) {
                await Cloudinary.uploader.destroy(
                    updVehicle.vehicleImage.filename
                );
            }

            updVehicle.vehicleImage = {
                url: req.file.path,
                filename: req.file.filename
            };
        }

        await updVehicle.save();

        req.flash(
            'success',
            'Vehicle Updated Successfully'
        );

        res.redirect('/admin/our-vehicle');
    })

//Our Vehicle Delete Route
module.exports.OurVehicleDeleteRoute = WrapAsync(async (req, res) => {

    const dltVehicle = await OurVehicle.findById(req.params.id);

    if (!dltVehicle) {
        req.flash('error', 'Vehicle not found');
        return res.redirect('/admin/our-vehicle');
    }

    // Delete image from Cloudinary
    if (dltVehicle.vehicleImage?.filename) {
        await Cloudinary.uploader.destroy(
            dltVehicle.vehicleImage.filename
        );
    }

    // Delete record from database
    await OurVehicle.findByIdAndDelete(req.params.id);

    req.flash(
        'success',
        'Vehicle Deleted Successfully'
    );

    res.redirect('/admin/our-vehicle');
});
