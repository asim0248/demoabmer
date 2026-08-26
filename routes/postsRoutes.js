const express = require('express');
const router = express.Router();

const { toggleStatus, toggleField, toggleBlogStatus} = require('../controller/commonStatusController');

const postsController = require('../controller/postsController.js');

//WrapAsync
const WrapAsync = require('../utils/WrapAsync');

// All Middlewares
const { isLoggedIn, hasPermission } = require('../utils/middlewares.js');

const Blogposts = require('../models/blog-posts.js');

const Cloudinary = require('cloudinary');

// File upload package
const multer = require('multer');
const { storage } = require('../config/CloudConfig');

// Multer configuration
const upload = multer({ storage });
//Render Posts Page
router.get('/admin/blog/posts', isLoggedIn, hasPermission('blog-posts'), postsController.renderPostPage);

//Render Add New Post Page
router.get('/admin/blog/posts/add', isLoggedIn, hasPermission('blog-posts'), postsController.renderAddNewPostPage);

//Render Edit Post Page
router.get('/admin/blog/posts/:id/edit', isLoggedIn, hasPermission('blog-posts'), postsController.renderEditPostPage);

router.post('/admin/blog/posts/add',
    isLoggedIn, hasPermission('blog-posts'),
    upload.fields([{ name: 'featureImage', maxCount: 1 }, { name: 'detailImage', maxCount: 1 }]),
    postsController.addNewPostRoute
    );

router.put(
    '/admin/blog/posts/:id',
    isLoggedIn,
    hasPermission('blog-post'),
    upload.fields([
        { name: 'featureImage', maxCount: 1 },
        { name: 'detailImage', maxCount: 1 }
    ]),
    postsController.updatePostRoute
    
);

router.delete(
    '/admin/blog/posts/:id',
    isLoggedIn,
    hasPermission('blog-post'),
    postsController.deletePostRoute
);


//Status Change Route
router.post('/admin/blog/posts/:id/toggle-status',
    isLoggedIn,
    hasPermission('blog-posts'),
    toggleStatus(Blogposts)
);

//Featured Route
router.post("/admin/blog/posts/:id/toggle-featured", hasPermission('blog-posts'), isLoggedIn, WrapAsync(async (req, res) => {
    const sngpost = await toggleField(
        Blogposts,
        req.params.id,
        "isFeatured",
        "Featured",
        "Not-Featured"
    );

    res.json({
        success: true,
        value: sngpost.isFeatured
    });
})
);

module.exports = router;