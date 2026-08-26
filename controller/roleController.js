
//Role Model
const Role = require('../models/role');

// Role Sections
const sections = require('../config/adminSections');

//WrapAsync
const WrapAsync = require('../utils/WrapAsync');

// Admin Role Add new route
module.exports.renderNewRolePage = WrapAsync(async (req, res) => {
    res.render('admin/adminrole/role/add', {sections});
});

//Admin Role Delete Route
module.exports.renderDeleteRole =  WrapAsync(async (req, res) => {

    try {

        await Role.findByIdAndDelete(req.params.id);

        req.flash(
            'success',
            'Role Deleted successfully'
        );

        res.redirect('/admin/role');

    } catch (err) {

        req.flash(
            'error',
            err.message
        );

        res.redirect('/admin/role');
    }

});

//Admin Role Show view Route
module.exports.renderViewRolePage = WrapAsync(async (req, res) => {

    const roles = await Role.find().sort({ createdAt: -1 });

    res.render('admin/adminrole/role/view', {
        roles
    });

});

//Admin Role Show Edit Route 
module.exports.renderEditRolePage = WrapAsync(async (req, res) => {

    const role = await Role.findById(req.params.id);

    if (!role) {

        req.flash(
            'error',
            'Role not found'
        );

        return res.redirect('/admin/role');
    }

    res.render('admin/adminrole/role/edit.ejs', {
        role,
        sections
    });

});

//Admin Role Add Route
module.exports.addNewRoleRoute = WrapAsync(async (req, res) => {

    try {

        const { name, status } = req.body;

        const permissions = req.body.permissions || [];

        await Role.create({
            name,
            permissions,
            status: status === 'true'
        });

        req.flash(
            'success',
            'Role added successfully'
        );

        res.redirect('/admin/role');

    } catch (err) {

        req.flash(
            'error',
            err.message
        );

        res.redirect('/admin/role/add');
    }

});

module.exports.updateRoleRoute = WrapAsync(async (req, res) => {

    try {

        const {
            name,
            status
        } = req.body;

        const permissions = req.body.permissions || [];

        await Role.findByIdAndUpdate(
            req.params.id,
            {
                name,
                permissions,
                status: status === 'true'
            }
        );

        req.flash(
            'success',
            'Role updated successfully'
        );

        res.redirect('/admin/role');

    } catch (err) {

        req.flash(
            'error',
            err.message
        );

        res.redirect(`/admin/role/edit/${req.params.id}`);
    }

});