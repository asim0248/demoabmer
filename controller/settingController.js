const Setting = require('../models/setting.js');


//WrapAsync
const WrapAsync = require('../utils/WrapAsync');

module.exports.rendersettingPage = WrapAsync(async (req, res) => {
    const settings = await Setting.findOne();
    res.render("admin/setting/setting", {settings});
});

module.exports.updatesettingPage = WrapAsync(async (req, res) => {

        let settings = await Setting.findOne();

        if (!settings) {
            settings = new Setting();
        }

        // Text Fields
        Object.assign(settings, req.body);

        // Website Logo
        if (req.files.websitelogo) {
            settings.websitelogo = {
                url: req.files.websitelogo[0].path,
                filename: req.files.websitelogo[0].filename
            };
        }

                // Website Logo
        if (req.files.websitewhitelogo) {
            settings.websitewhitelogo = {
                url: req.files.websitewhitelogo[0].path,
                filename: req.files.websitewhitelogo[0].filename
            };
        }

        // Admin Logo
        if (req.files.adminlogo) {
            settings.adminlogo = {
                url: req.files.adminlogo[0].path,
                filename: req.files.adminlogo[0].filename
            };
        }

        // Website Favicon
        if (req.files.websitefavicon) {
            settings.websitefavicon = {
                url: req.files.websitefavicon[0].path,
                filename: req.files.websitefavicon[0].filename
            };
        }

        // Admin Favicon
        if (req.files.websiteadminfavicon) {
            settings.websiteadminfavicon = {
                url: req.files.websiteadminfavicon[0].path,
                filename: req.files.websiteadminfavicon[0].filename
            };
        }

        await settings.save();

        req.flash('success', 'Settings updated successfully');
        res.redirect('/admin/setting');
    })
