const express = require('express');
const router = express.Router();

// All Middlewares
const { isLoggedIn, hasPermission } = require('../utils/middlewares.js');

//WrapAsync
const WrapAsync = require('../utils/WrapAsync');

const { toggleStatus } = require('../controller/commonStatusController');

//Tags Controller
const tagsController = require('../controller/tagsController.js');

const Blogtags = require('../models/blog-tags.js');

//Render Tag Page
router.get('/admin/blog/blog-tags', isLoggedIn, hasPermission('blog-post'), tagsController.renderTagPage);

//Render Add New Tag Page
router.get('/admin/blog/blog-tags/add', isLoggedIn, hasPermission('blog-post'), tagsController.renderAddNewTagPage);

//Render Edit Tag Page
router.get('/admin/blog/blog-tags/:id/edit', isLoggedIn, hasPermission('blog-post'), tagsController.renderEditTagPage);

//Add New Tag Route
router.post('/admin/blog-tags/add', isLoggedIn, hasPermission('blog-post'), tagsController.addNewTagRoute);

//Update Tag Route
router.put('/admin/blog/blog-tags/:id', isLoggedIn, hasPermission('blog-post'), tagsController.updateTagRoute);

//Delete Tag Route
router.delete('/admin/blog/blog-tags/:id', isLoggedIn, hasPermission('blog-category'), tagsController.deleteTagRoute);

//Status Change Route
router.post('/admin/blog/blog-tags/:id/toggle-status',
    isLoggedIn,
    hasPermission('blog-post'),
    toggleStatus(Blogtags)
);

module.exports = router;