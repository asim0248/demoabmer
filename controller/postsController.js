
const Blogposts = require('../models/blog-posts.js');

const Blogcategory = require('../models/blog-category.js');

const Blogtags = require('../models/blog-tags.js');

//WrapAsync
const WrapAsync = require('../utils/WrapAsync');

//Render Posts Page
module.exports.renderPostPage = WrapAsync(async (req, res) => {
    const allBlogs = await Blogposts.find().sort({ createdAt: -1 });
    res.render('admin/posts/view', { allBlogs })
});

//Render Add New Post Page
module.exports.renderAddNewPostPage = WrapAsync(async (req, res) => {
    const category = await Blogcategory.find();
    const tags = await Blogtags.find();
    res.locals.pageScript = 'blog';
    res.render('admin/posts/add', { category, tags });
});

//Render Edit Post Page
module.exports.renderEditPostPage = WrapAsync(async (req, res) => {
    const singlePost = await Blogposts.findById(req.params.id)
        .populate('category')
        .populate('tags');

    if (!singlePost) {
        req.flash('error', 'Post not found');
        return res.redirect('/admin/blog/posts');
    }

    const category = await Blogcategory.find();
    const tags = await Blogtags.find();

    res.locals.pageScript = 'blog';

    res.render('admin/posts/edit', {
        singlePost,
        category,
        tags
    });
});

//Add New Post Route
module.exports.addNewPostRoute = WrapAsync(async (req, res) => {
    const {
        blogTitle,
        slug,
        category,
        tags,
        sortOrder,
        shortContent,
        metaTitle,
        metaKeywords,
        metaDescription,
        detailContent,
        publishType,
        publishDate
    } = req.body;

    const existingSlug = await Blogposts.findOne({ slug });

    if (existingSlug) {
        req.flash('error', 'Slug already exists');
        return res.redirect('/admin/blog/posts/add');
    }

    if (publishType === 'Schedule' && !publishDate) {
        req.flash('error', 'Please select publish date');
        return res.redirect('/admin/blog/posts/add');
    }

    if (
        publishType === 'Schedule' &&
        new Date(publishDate) <= new Date()
    ) {
        req.flash('error', 'Schedule date must be in the future');
        return res.redirect('/admin/blog/posts/add');
    }

    const newBlog = new Blogposts({
        blogTitle,
        slug,
        category,
        tags,
        sortOrder,
        shortContent,
        metaTitle,
        metaKeywords,
        metaDescription,
        detailContent,
        publishType,
        publishDate: publishType === 'Schedule'
            ? publishDate
            : null,
        author: req.user._id
    });

    // Blog Feature Image
    if (req.files?.featureImage?.length) {
        newBlog.featureImage = {
            url: req.files.featureImage[0].path,
            filename: req.files.featureImage[0].filename
        };
    }

    // Detail Image
    if (req.files?.detailImage?.length) {
        newBlog.detailImage = {
            url: req.files.detailImage[0].path,
            filename: req.files.detailImage[0].filename
        };
    }

    await newBlog.save();

    req.flash('success', 'Post added successfully');
    res.redirect('/admin/blog/posts');

});

//Update Post Route
module.exports.updatePostRoute = WrapAsync(async (req, res) => {

    const updatepost = await Blogposts.findById(req.params.id);

    if (!updatepost) {
        req.flash('error', 'Post not found');
        return res.redirect('/admin/blog/posts');
    }

    const {
        blogTitle,
        slug,
        sortOrder,
        metaTitle,
        metaKeywords,
        metaDescription,
        shortContent,
        detailContent,
        category,
        tags,
        publishType,
        publishDate
    } = req.body;

    // Check duplicate slug (except current post)
    const existingSlug = await Blogposts.findOne({
        slug,
        _id: { $ne: req.params.id }
    });

    if (existingSlug) {
        req.flash('error', 'Slug already exists');
        return res.redirect('back');
    }

    // Schedule Validation
    if (publishType === 'Schedule' && !publishDate) {
        req.flash('error', 'Please select publish date');
        return res.redirect('back');
    }

    if (
        publishType === 'Schedule' &&
        new Date(publishDate) <= new Date()
    ) {
        req.flash('error', 'Schedule date must be in the future');
        return res.redirect('back');
    }

    // Update fields
    updatepost.blogTitle = blogTitle;
    updatepost.slug = slug;
    updatepost.sortOrder = sortOrder || 0;
    updatepost.metaTitle = metaTitle;
    updatepost.metaKeywords = metaKeywords;
    updatepost.metaDescription = metaDescription;
    updatepost.shortContent = shortContent;
    updatepost.detailContent = detailContent;
    updatepost.category = category || [];
    updatepost.tags = tags || [];

    // Schedule Fields
    updatepost.publishType = publishType;
    updatepost.publishDate =
        publishType === 'Schedule'
            ? publishDate
            : null;

    // Feature Image Update
    if (
        req.files &&
        req.files.featureImage &&
        req.files.featureImage.length > 0
    ) {
        updatepost.featureImage = {
            url: req.files.featureImage[0].path,
            filename: req.files.featureImage[0].filename
        };
    }

    // Detail Image Update
    if (
        req.files &&
        req.files.detailImage &&
        req.files.detailImage.length > 0
    ) {
        updatepost.detailImage = {
            url: req.files.detailImage[0].path,
            filename: req.files.detailImage[0].filename
        };
    }

    await updatepost.save();

    req.flash('success', 'Post Updated Successfully');
    res.redirect('/admin/blog/posts');

});

//Delete Post Route
module.exports.deletePostRoute = WrapAsync(async (req, res) => {

    const deletePost = await Blogposts.findById(req.params.id);

    if (!deletePost) {
        req.flash('error', 'Post not found');
        return res.redirect('/admin/blog/posts');
    }

    await Blogposts.findByIdAndDelete(req.params.id);

    req.flash('success', 'Post Deleted Successfully');
    res.redirect('/admin/blog/posts');
})