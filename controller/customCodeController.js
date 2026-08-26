
//User model
const CustomCode = require('../models/custom-code.js');

//WrapAsync
const WrapAsync = require('../utils/WrapAsync');

//Render Custom Code Page
module.exports.renderCustomCodePage = WrapAsync(async (req, res) => {

    let customCode = await CustomCode.findOne();

    if (!customCode) {
        customCode = await CustomCode.create({});
    }
    res.locals.pageScript = 'custom-code';

    res.render('admin/custom-code/custom-code.ejs', {
        customCode
    });

});

//Update Custom Code Page
module.exports.updateCustomCodeRoute = WrapAsync(async (req, res) => {

    const {
        headerCode,
        footerCode,
        cssCode,
        jsCode
    } = req.body;

    let customCode = await CustomCode.findOne();

    if (!customCode) {

        await CustomCode.create({
            headerCode,
            footerCode,
            cssCode,
            jsCode
        });

    } else {

        customCode.headerCode = headerCode;
        customCode.footerCode = footerCode;
        customCode.cssCode = cssCode;
        customCode.jsCode = jsCode;

        await customCode.save();
    }

    req.flash('success', 'Custom Code Updated Successfully');

    res.redirect('/admin/custom-code');

})