const Blogtags = require('../models/blog-tags.js');

//WrapAsync
const WrapAsync = require('../utils/WrapAsync');

//Render Tag Page
module.exports.renderTagPage = WrapAsync(async (req, res) => {
    const allTags = await Blogtags.find().sort({ craetedAt: -1 });
    res.render('admin/blog-tags/view', { allTags })
});

//Render Add New Tag Page
module.exports.renderAddNewTagPage = (req, res) => {
    res.locals.pageScript = 'tags';
    res.render('admin/blog-tags/add');
};

//Render Edit Tag Page
module.exports.renderEditTagPage = WrapAsync(async (req, res) => {
    const singleTag = await Blogtags.findById(req.params.id);
    res.locals.pageScript = 'tags';
    res.render('admin/blog-tags/edit', { singleTag })
});

//Add New Tag Route
module.exports.addNewTagRoute = WrapAsync(async (req, res) => {
    const { tagName, slug } = req.body;

    const existingTag = await Blogtags.findOne({ tagName });

    if (existingTag) {
        req.flash('error', 'Tag Name already exists');
        return res.redirect('/admin/blog-tags/add');
    }

    const newTags = new Blogtags({
        tagName, slug
    });

    await newTags.save();
    req.flash('success', 'Tag added successfully');
    res.redirect('/admin/blog/blog-tags/');
});

//Update Tag Route
module.exports.updateTagRoute = WrapAsync(async (req, res) => {

    const updateTag = await Blogtags.findById(req.params.id);

    if (!updateTag) {
        req.flash('error', 'Tag Not Found');
        return res.redirect('/admin/blog/blog-tags');
    }

    if (!req.body.tagName?.trim()) {
        req.flash('error', 'Tag Name is required');
        return res.redirect(`/admin/blog/blog-tags/${req.params.id}/edit`);
    }

    const existingTag = await Blogtags.findOne({
        tagName: req.body.tagName.trim(),
        _id: { $ne: req.params.id }
    });

    if (existingTag) {
        req.flash('error', 'Tag Name already exists');
        return res.redirect(`/admin/blog/blog-tags/${req.params.id}/edit`);
    }

    updateTag.tagName = req.body.tagName.trim();

    await updateTag.save();

    req.flash('success', 'Tag Updated Successfully');
    res.redirect('/admin/blog/blog-tags');
})

//Delete Tag Route
module.exports.deleteTagRoute = WrapAsync(async (req, res) => {
    const deleteTag = await Blogtags.findById(req.params.id);
    if (!deleteTag) {
        req.flash('error', 'Tag Not Found');
        return res.redirect('/admin/blog/blog-tags');
    }
    await deleteTag.deleteOne();

    req.flash('success', 'Tag Deleted Successfully');

    res.redirect('/admin/blog/blog-tags');
})