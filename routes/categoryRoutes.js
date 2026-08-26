const express = require('express');
const router = express.Router();

const Blogcategory = require('../models/blog-category.js');

const { isLoggedIn, hasPermission } = require('../utils/middlewares.js');

//WrapAsync
const WrapAsync = require('../utils/WrapAsync');

//Category Controller
const categoryController = require('../controller/categoryController.js');


const { toggleStatus } = require('../controller/commonStatusController');

//Render Categoy Page
router.get('/admin/blog/blog-category', isLoggedIn, hasPermission('blog-post'), categoryController.renderCategoryPage);

//Render Add New Categoy Page
router.get('/admin/blog/blog-category/add', isLoggedIn, hasPermission('blog-post'), categoryController.renderAddNewCategoryPage);

//Render Edit category Page
router.get('/admin/blog/blog-category/:id/edit', isLoggedIn, hasPermission('blog-post'), categoryController.renderEditCategoryPage)

//Add New Categoy Route
router.post('/admin/blog-category/add', isLoggedIn, hasPermission('blog-post'), categoryController.addNewCategoryRoute);

// Update Categoy Route
router.put('/admin/blog/blog-category/:id', isLoggedIn, hasPermission('blog-post'), categoryController.updateCategoryRoute );

//Delete Categoy Route
router.delete('/admin/blog/blog-category/:id', isLoggedIn, hasPermission('blog-category'),  categoryController.deleteCategoryRoute);

//Status Change Route
router.post('/admin/blog/blog-category/:id/toggle-status',
    isLoggedIn,
    hasPermission('blog-post'),
    toggleStatus(Blogcategory)
);

module.exports = router;