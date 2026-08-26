const slugify = require('slugify');

//Pages model
const Pages = require('../models/pages.js');


//WrapAsync
const WrapAsync = require('../utils/WrapAsync');

//Render Pages Module
module.exports.renderPagesModule = WrapAsync(async (req, res) => {
    const allPages = await Pages.find().sort({ createAt: -1 });

    res.render('admin/pages/view', { allPages });
});

//Render Add New Page 
module.exports.renderAddNewPage = (req, res) => {
    res.locals.pageScript = 'pages';
    res.render('admin/pages/add');
};

//Render Edit Page 
module.exports.renderEditPage = WrapAsync(async (req, res) => {
    const singlePage = await Pages.findById(req.params.id);
    res.locals.pageScript = 'pages';
    res.render('admin/pages/edit', { singlePage });
});

//Add New Page Route
module.exports.addNewPageRoute = WrapAsync(async (req, res) => {
    const {
        pageName,
        slug,
        menuOrder,
        metaTitle,
        metaKeywords,
        metaDescription,
        pageContent,
        sectionTagLine,
        sectionHeading
    } = req.body;

    // Agar slug empty ho to pageName se generate karo
    const finalSlug = slugify(pageName, {
        lower: true,
        strict: true
    });

    const existingPage = await Pages.findOne({ pageName });

    if (existingPage) {
        req.flash('error', 'Page name already exists');
        return res.redirect('/admin/pages/add');
    }


    const existingSlug = await Pages.findOne({ slug });

    if (existingSlug) {
        req.flash('error', 'Slug already exists');
        return res.redirect('/admin/pages/add');
    }

    const newPage = new Pages({
        pageName,
        slug: finalSlug,
        menuOrder,
        metaTitle,
        metaKeywords,
        metaDescription,
        pageContent,
        sectionTagLine,
        sectionHeading
    });

    await newPage.save();

    req.flash('success', 'Page added successfully');
    res.redirect('/admin/pages');
});

//Update Page Route
module.exports.updatePageRoute = WrapAsync(async (req, res) => {
    const updatePage = await Pages.findById(req.params.id);
    if (!updatePage) {
        req.flash('error', 'Page Not Found');
        return res.redirect('/admin/pages');
    }
    if (!req.body.pageName?.trim()) {
        req.flash("error", "Page Name is required");
        return res.redirect(`/admin/pages/${req.params.id}/edit`);
    }
    if (!req.body.slug?.trim()) {
        req.flash("error", "Page Slug is required");
        return res.redirect(`/admin/pages/${req.params.id}/edit`);
    }

    updatePage.pageName = req.body.pageName?.trim();
    updatePage.sectionTagLine = req.body.sectionTagLine?.trim();
    updatePage.sectionHeading = req.body.sectionHeading?.trim();
    updatePage.slug = req.body.slug?.trim();
    updatePage.metaTitle = req.body.metaTitle?.trim();
    updatePage.metaDescription = req.body.metaDescription?.trim();
    updatePage.metaKeywords = req.body.metaKeywords?.trim();
    updatePage.pageContent = req.body.pageContent?.trim();
    updatePage.menuOrder = req.body.menuOrder ? Number(req.body.menuOrder) : 0;

    await updatePage.save();
    req.flash(
        'success',
        'Page Updated Successfully'
    );


    res.redirect('/admin/pages');
});

//Delete Page Route
module.exports.deletePageRoute = WrapAsync(async (req, res) => {
    const deletePage = await Pages.findById(req.params.id);
    if (!deletePage) {
        req.flash('error', 'Page Not Found');
        return res.redirect('/admin/pages');
    }
    await deletePage.deleteOne();

    req.flash('success', 'Page Deleted Successfully');

    res.redirect('/admin/pages');
})