//Our Vehicle model
const DamageVehicle = require('../models/damage-vehicle.js');

//WrapAsync
const WrapAsync = require('../utils/WrapAsync.js');

const Cloudinary = require('cloudinary');

//Render Damage vehicle Page
module.exports.renderdamageVehiclePage = WrapAsync(async(req, res) => {
    const damageVehicle = await DamageVehicle.find().sort({ createdAt: -1 });
    res.render('admin/damage-vehicle/view', {damageVehicle});
});

// Render Add New Damage vehicle 
module.exports.renderAddDamageVehiclePage = WrapAsync(async(req, res) => {
    res.render('admin/damage-vehicle/add');
});

//Add New Damage vehicle Route
module.exports.addNewdamageVehicleRoute = WrapAsync(async (req, res) => {
    if (!req.file) {
        req.flash("error", "Vehicle Image is required");
        return res.redirect("back");
    }

    const damageVehicle = new DamageVehicle({
        altText: req.body.altText?.trim(),
        sortOrder: req.body.sortOrder
                ? Number(req.body.sortOrder)
                : 0,
        dmgImage: {
            url: req.file.path,
            filename: req.file.filename
        }
    });

    await damageVehicle.save();

    req.flash("success", "Vehicle Added Successfully");
    res.redirect("/admin/damage-vehicle");
});

//Render Damage vehicle Update Route
module.exports.renderdamageVehicleEditPage = WrapAsync(async(req, res) => {
        let editDmgvehicle = await DamageVehicle.findById(req.params.id);
    
        if (!editDmgvehicle) {
            req.flash('error', 'Vehicle not found');
            return res.redirect('/admin/damage-vehicle');
        }
    res.render('admin/damage-vehicle/edit', {editDmgvehicle});
});

//Damage vehicle Update Route
module.exports.damageVehicleUpdateRoute = WrapAsync(async (req, res) => {

        const updDmgVehicle = await DamageVehicle.findById(req.params.id);

        if (!updDmgVehicle) {
            req.flash('error', 'Vehicle not found');
            return res.redirect('/admin/damage-vehicle');
        }

        updDmgVehicle.altText = req.body.altText?.trim();

        updDmgVehicle.sortOrder = req.body.sortOrder
            ? Number(req.body.sortOrder)
            : 0;

        if (req.file) {

            if (updDmgVehicle.dmgImage?.filename) {
                await Cloudinary.uploader.destroy(
                    updDmgVehicle.dmgImage.filename
                );
            }

            updDmgVehicle.dmgImage = {
                url: req.file.path,
                filename: req.file.filename
            };
        }

        await updDmgVehicle.save();

        req.flash(
            'success',
            'Vehicle Updated Successfully'
        );

        res.redirect('/admin/damage-vehicle');
    });

// Damage vehicle Delete Route
module.exports.damageVehicleDeleteRoute = WrapAsync(async (req, res) => {
    
        const dltDmgVehicle = await DamageVehicle.findById(req.params.id);
    
        if (!dltDmgVehicle) {
            req.flash('error', 'Vehicle not found');
            return res.redirect('/admin/damage-vehicle');
        }
    
        // Delete image from Cloudinary
        if (dltDmgVehicle.dmgImage?.filename) {
            await Cloudinary.uploader.destroy(
                dltDmgVehicle.dmgImage.filename
            );
        }
    
        // Delete record from database
        await DamageVehicle.findByIdAndDelete(req.params.id);
    
        req.flash(
            'success',
            'Vehicle Deleted Successfully'
        );
    
        res.redirect('/admin/damage-vehicle');
    })