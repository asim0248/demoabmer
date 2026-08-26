const express = require('express');
const router = express.Router();

//WrapAsync
const WrapAsync = require('../utils/WrapAsync');

//Pages model
const Pages = require('../models/pages.js');
// All Middlewares
const { isLoggedIn, hasPermission } = require('../utils/middlewares.js');

const pagesController = require('../controller/pagesController.js');

const { toggleStatus, toggleField, toggleHeader, toggleFooter } = require('../controller/commonStatusController');

//Render Pages Module
router.get('/admin/pages', isLoggedIn, hasPermission('pages'), pagesController.renderPagesModule);

//Render Add New Page 
router.get('/admin/pages/add', isLoggedIn, hasPermission('pages'), pagesController.renderAddNewPage);

//Render Edit Page 
router.get('/admin/pages/:id/edit', isLoggedIn, hasPermission('pages'), pagesController.renderEditPage);

//Add New Page Route
router.post('/admin/pages/add', isLoggedIn, hasPermission('pages'), pagesController.addNewPageRoute);

//Update Page Route
router.put('/admin/pages/:id', isLoggedIn, hasPermission('pages'), pagesController.updatePageRoute);

//Delete Page Route
router.delete('/admin/pages/:id', isLoggedIn, hasPermission('pages'), pagesController.deletePageRoute);

//Status Change Route
router.post('/admin/pages/:id/toggle-status',
    isLoggedIn,
    hasPermission('pages'),
    toggleStatus(Pages)
);

//Toggle Header Route
router.post("/admin/pages/:id/toggle-header", hasPermission('pages'), isLoggedIn, WrapAsync(async (req, res) => {
    const sngpage = await toggleHeader(
        Pages,
        req.params.id,
        "isHeader",
        "Yes",
        "No"
    );

    res.json({
        success: true,
        value: sngpage.isHeader
    });
})
);

//Toggle Footer Route
router.post("/admin/pages/:id/toggle-footer", hasPermission('pages'), isLoggedIn, WrapAsync(async (req, res) => {
    const sngPageFoot = await toggleFooter(
        Pages,
        req.params.id,
        "isFooter",
        "Yes",
        "No"
    );

    res.json({
        success: true,
        value: sngPageFoot.isFooter
    });
})
);

module.exports = router;