//slugify
const slugify = require('slugify');


const Blogcategory = require('../models/blog-category.js');

//WrapAsync
const WrapAsync = require('../utils/wrapAsync');

//Render Categoy Page
module.exports.renderCategoryPage = WrapAsync(async (req, res) => {
    const allCategory = await Blogcategory.find().sort({ craetedAt: -1 });
    res.render('admin/blog-category/view', { allCategory })
});

//Render Add New Categoy Page
module.exports.renderAddNewCategoryPage = (req, res) => {
    res.locals.pageScript = 'blog-post';
    res.render('admin/blog-category/add');
};

//Render Edit category Page
module.exports.renderEditCategoryPage = WrapAsync(async (req, res) => {
    const singleCategory = await Blogcategory.findById(req.params.id);
    res.locals.pageScript = 'blog-post';
    res.render('admin/blog-category/edit', { singleCategory })
});

//Add New Categoy Route
module.exports.addNewCategoryRoute = WrapAsync(async (req, res) => {
    res.locals.pageScript = 'blog-post';
    const { categoryName, slug, metaTitle, metaKeywords, metaDescription } = req.body;

    // Agar slug empty ho to pageName se generate karo
    const finalSlug = slugify(categoryName, {
        lower: true,
        strict: true
    });

    const existingSlug = await Blogcategory.findOne({ slug });

    if (existingSlug) {
        req.flash('error', 'Slug already exists');
        return res.redirect('/admin/blog-category/add');
    }

    const existingCategory = await Blogcategory.findOne({ categoryName });

    if (existingCategory) {
        req.flash('error', 'Category Name already exists');
        return res.redirect('/admin/blog-category/add');
    }

    const newCategory = new Blogcategory({
        categoryName,
        slug: finalSlug,
        metaTitle,
        metaKeywords,
        metaDescription,
    });

    await newCategory.save();
    req.flash('success', 'Category added successfully');
    return res.redirect('/admin/blog/blog-category/');
});

// Update Categoy Route
module.exports.updateCategoryRoute = WrapAsync(async (req, res) => {

    const updateCategory = await Blogcategory.findById(req.params.id);

    if (!updateCategory) {
        req.flash('error', 'Category Not Found');
        return res.redirect('/admin/blog/blog-category');
    }

    if (!req.body.categoryName?.trim()) {
        req.flash('error', 'Category Name is required');
        return res.redirect(`/admin/blog/blog-category/${req.params.id}/edit`);
    }

    if (!req.body.slug?.trim()) {
        req.flash('error', 'Category Slug is required');
        return res.redirect(`/admin/blog/blog-category/${req.params.id}/edit`);
    }

    const existingCategory = await Blogcategory.findOne({
        categoryName: req.body.categoryName.trim(),
        _id: { $ne: req.params.id }
    });

    if (existingCategory) {
        req.flash('error', 'Category Name already exists');
        return res.redirect(`/admin/blog/blog-category/${req.params.id}/edit`);
    }

    const existingSlug = await Blogcategory.findOne({
        slug: req.body.slug.trim(),
        _id: { $ne: req.params.id }
    });

    if (existingSlug) {
        req.flash('error', 'Slug already exists');
        return res.redirect(`/admin/blog/blog-category/${req.params.id}/edit`);
    }

    updateCategory.categoryName = req.body.categoryName.trim();
    updateCategory.slug = req.body.slug.trim();
    updateCategory.metaTitle = req.body.metaTitle?.trim();
    updateCategory.metaDescription = req.body.metaDescription?.trim();
    updateCategory.metaKeywords = req.body.metaKeywords?.trim();

    await updateCategory.save();

    req.flash('success', 'Category Updated Successfully');
    return res.redirect('/admin/blog/blog-category');
});

//Delete Categoy Route
module.exports.deleteCategoryRoute = WrapAsync(async (req, res) => {
    const deleteCategory = await Blogcategory.findById(req.params.id);
    if (!deleteCategory) {
        req.flash('error', 'Category Not Found');
        return res.redirect('/admin/blog/blog-category');
    }
    await deleteCategory.deleteOne();

    req.flash('success', 'Category Deleted Successfully');

    return res.redirect('/admin/blog/blog-category');
})
