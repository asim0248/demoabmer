const User = require('../models/user');

module.exports.isLoggedIn = (req, res, next) => {

    if(!req.isAuthenticated()) {

        req.flash("error", "Please login first");

        return res.redirect('/admin/login');
    }

    next();
}

module.exports.hasPermission = (permission) => {

    return async (req, res, next) => {

        if (!req.user) {

            req.flash(
                'error',
                'Please login first'
            );

            return res.redirect('/admin/login');
        }

        // Master Admin bypass
        if (req.user.isMasterAdmin) {
            return next();
        }

        const user = await User.findById(req.user._id)
            .populate('role');

        if (
            !user ||
            !user.role ||
            !user.role.permissions.includes(permission)
        ) {

            req.flash(
                'error',
                'Access Denied'
            );

            return res.redirect('/admin/dashboard');
        }

        next();
    };

};