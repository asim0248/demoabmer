//WrapAsync
const WrapAsync = require('../utils/WrapAsync');

// User Model
const User = require('../models/user.js'); 

module.exports.renderChangePassword = WrapAsync(async (req, res) => {
    res.render("admin/myaccount/changepassword");
});


module.exports.passwordUpdateRoute = WrapAsync(async (req, res) => {

    const {
        username,
        email,
        currentpassword,
        newpassword
    } = req.body;

    const user = await User.findById(req.user._id);

    // Update username
    user.username = username;

    // Update email
    user.email = email;

    // Change password if provided
    if (currentpassword && newpassword) {

        try {

            await user.changePassword(
                currentpassword,
                newpassword
            );

        } catch (err) {

            req.flash(
                'error',
                'Current password is incorrect'
            );

            return res.redirect('/admin/changepassword');
        }
    }

    await user.save();

    // Refresh session after username change
    req.login(user, (err) => {

        if (err) {

            req.flash(
                'error',
                'Please login again'
            );

            return res.redirect('/admin/login');
        }

        req.flash(
            'success',
            'Account updated successfully'
        );

        res.redirect('/admin/changepassword');
    });

})