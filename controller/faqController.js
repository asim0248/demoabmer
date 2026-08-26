//FAQ model
const Faq = require('../models/faq.js');

//WrapAsync
const WrapAsync = require('../utils/WrapAsync');

//Render All faq Page
module.exports.renderAllFaqPage = WrapAsync(async (req, res) => {
    let allFaq = await Faq.find().sort({ createdAt: -1 });
    res.render('admin/faq/view', { allFaq });
});

//Render Add New faq Page
module.exports.renderAddNewfaqPage = (req, res) => {
    res.render('admin/faq/add');
};

//Render Edit faq Page
module.exports.renderfaqEditPage = WrapAsync(async (req, res) => {
    let editFaq = await Faq.findById(req.params.id);

    if (!editFaq) {
        req.flash('error', 'Faq not found');
        return res.redirect('/admin/faq');
    }
    res.render('admin/faq/edit', { editFaq });
});

//Add New faq route
module.exports.addNewFaqRoute =  WrapAsync(async (req, res) => {

    if (!req.body.question?.trim() || !req.body.answer?.trim()) {
        req.flash("error", "Question and Answer fields are required");
        return res.redirect("back");
    }

    const newFaq = new Faq({
        question: req.body.question?.trim(),
        answer: req.body.answer?.trim(),
        sortOrder: req.body.sortOrder
            ? Number(req.body.sortOrder)
            : 0,
    });

    await newFaq.save();

    req.flash("success", "Faq Added Successfully");
    res.redirect("/admin/faq");
});

//Faq update route
module.exports.updateFaqRoute = WrapAsync(async (req, res) => {

    const updFaq = await Faq.findById(req.params.id);

    if (!updFaq) {
        req.flash('error', 'Faq not found');
        return res.redirect('/admin/faq');
    }

    updFaq.question = req.body.question?.trim();
    updFaq.answer = req.body.answer?.trim();

    updFaq.sortOrder = req.body.sortOrder
        ? Number(req.body.sortOrder)
        : 0;

    await updFaq.save();

    req.flash(
        'success',
        'Faq Updated Successfully'
    );

    res.redirect('/admin/faq');
});

//Faq Delete route
module.exports.faqDeleteRoute = WrapAsync(async (req, res) => {

    const dltFaq = await Faq.findById(req.params.id);

    if (!dltFaq) {
        req.flash('error', 'Faq not found');
        return res.redirect('/admin/faq');
    }

    // Delete record from database
    await dltFaq.deleteOne();

    req.flash(
        'success',
        'Faq Deleted Successfully'
    );

    res.redirect('/admin/faq');
})