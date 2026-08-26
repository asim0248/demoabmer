

//Newsletter model
const Newsletter = require('../models/newsletter.js');

// Notification Model
const Notifications = require('../models/notifications.js');


const createNotification = require('../helper/notification-helper.js');
const loadNotifications = require("../middlewares/loadNotifications");
const getNotificationStyle = require('../helper/notification-style.js')

//WrapAsync
const WrapAsync = require('../utils/WrapAsync');

//Render Admin Newsletter Page
module.exports.renderNewsletterPage = WrapAsync(async (req, res) => {
    let allEmails = await await Newsletter.find().sort({ createdAt: -1 });
    res.render('admin/newsletter/view', { allEmails });
});

//Catch Newsletter Email Route 
module.exports.catchEmailRoute = async (req, res) => {
    try {

        const { redirectUrl } = req.body;
        const email = req.body.email?.trim().toLowerCase();

        if (!email) {
            req.flash('error', "Email is required");
            return res.redirect(redirectUrl || '/');
        }

        const existingEmail = await Newsletter.findOne({ email });

        if (existingEmail) {
            req.flash('error', 'Email already subscribed');
            return res.redirect(redirectUrl || '/');
        }

        const notifyNewsletter = await Newsletter.create({ email });

        await createNotification(
            "New Newsletter Subscriber",
            `${notifyNewsletter.email} subscribed to newsletter.`,
            "newsletter",
            notifyNewsletter._id,
            "Newsletter",
            '/admin/newsletter'
        );

        req.flash('success', 'Newsletter subscribed successfully');
        return res.redirect(redirectUrl || '/');

    } catch (err) {
        req.flash('error', 'Something went wrong');
        return res.redirect(req.body.redirectUrl || '/');
    }
};

//Newsletter Email Delete Route
module.exports.newsletterEmailDeleteRoute = WrapAsync(async (req, res) => {
    let delEmail = await Newsletter.findById(req.params.id);
    if (!delEmail) {
        req.flash('error', "Email Not Found");
        return res.redirect('admin/newsletter')
    }
    await Newsletter.findByIdAndDelete(req.params.id);
    req.flash('success', "Email Deleted Successfully")
    return res.redirect('/admin/newsletter')
});

//Export CSV Route
module.exports.exportCsvRoute = WrapAsync(async (req, res) => {
    const emails = await Newsletter.find().sort({ createdAt: -1 });
    let csv = 'Email,subscribed Date\n';
    emails.forEach(item => {

        const date = item.createdAt.toLocaleString('en-PK', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });
        csv += `"${item.email}", "${date}"\n`;
    });

    res.setHeader(
        'Content-Disposition',
        'attachment; filename=newsletter-subscribers.csv'
    );
    res.setHeader('Content-Type', 'text/csv');

    return res.send(csv);
})