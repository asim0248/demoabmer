const Pages = require('../models/pages.js');
const moment = require("moment");
//Services model
const Services = require('../models/what-we-offer.js');

//Hero Section model
const HeroSection = require('../models/hero-section.js');

//Our Vehicle model
const OurVehicle = require('../models/our-vehicle.js');

//Damage Vehicle model
const DamageVehicle = require('../models/damage-vehicle.js');

//Customer Reviews model
const Reviews = require('../models/customer-reviews.js');

//Blog Category model
const Blogcategory = require('../models/blog-category.js');

//Blog Tags model
const Blogtags = require('../models/blog-tags.js');

//Blog Posts model
const Blogposts = require('../models/blog-posts.js');

//Blog Comments model
const Blogcomments = require('../models/blog-comments.js');

const AboutUs = require('../models/about-us.js');

const WhyChooseUs = require('../models/why-choose-us.js');

const Faq = require('../models/faq.js');

//About Page About Section model
const AboutUsPage = require('../models/page-about-us.js');

// Contact Query Model
const ContactQuery = require('../models/contact-query.js');

//Newsletter model
const Newsletter = require('../models/newsletter.js');

const Setting = require('../models/setting.js');
const whatWeOffer = require('../models/what-we-offer.js');
const pageAboutUs = require('../models/page-about-us.js');
const blogPosts = require('../models/blog-posts.js');

const frontEndMiddleware = async (req, res, next) => {
    try {

        res.locals.headerPages = await Pages.find({
            status: 'Active',
            isHeader: 'Yes'
        }).sort({ menuOrder: 1 });

        res.locals.footerPages = await Pages.find({
            status: 'Active',
            isFooter: 'Yes'
        }).sort({ menuOrder: 1 });

        res.locals.headerServices = await Services.find({
            status: 'Active'
        }).sort({ sortOrder: 1 });

        res.locals.homeServices = await Services.find({
            status: 'Active',
            isFeatured: 'Featured'
        }).sort({ sortOrder: 1 });

        res.locals.ServicesPage = await Services.find({
            status: 'Active',
        }).sort({ sortOrder: 1 });

        res.locals.heroSection = await HeroSection.find({
            status: 'Active'
        }).sort({ sortOrder: 1 });

        res.locals.ourVehicle = await OurVehicle.find({
            status: 'Active',
            isFeatured: 'Featured'
        }).sort({ sortOrder: 1 });

        res.locals.pageOurVehicle = await OurVehicle.find({
            status: 'Active',
        }).sort({ sortOrder: 1 });

        res.locals.damageVehicle = await DamageVehicle.find({
            status: 'Active',
            isFeatured: 'Featured'
        }).sort({ sortOrder: 1 });

        res.locals.pageDamageVehicle = await DamageVehicle.find({
            status: 'Active',
        }).sort({ sortOrder: 1 });

        res.locals.detailTags = await Blogtags.find({
            status: 'Active'
        });

        res.locals.deatilCategories = await Blogcategory.find({
            status: 'Active'
        });

        res.locals.showAboutSection = await AboutUs.findOne({
            status: 'Active'
        });

        res.locals.showPageAboutSection = await AboutUsPage.findOne({
            status: 'Active'
        });

        res.locals.showWhyChooseSection = await WhyChooseUs.findOne({
            status: 'Active'
        });

        res.locals.showWfaqs = await Faq.find({
            status: 'Active'
        });

        //Counting each category Blogs
        for (let cat of res.locals.deatilCategories) {
            cat.blogCount = await Blogposts.countDocuments({
                category: cat._id,
                status: 'Active'
            });
        }

        res.locals.blogs = await Blogposts.find({
            status: 'Active',
            isFeatured: 'Featured',
            $or: [

                {
                    publishType: 'Publish'
                },

                {
                    publishType: 'Schedule',
                    publishDate: {
                        $lte: new Date()
                    }
                }

            ]
        }).populate('category').sort({ sortOrder: 1 }).limit(3);

        const allReviews = await Reviews.find({
            status: "Active",
            isFeatured: "Featured",
        }).sort({ sortOrder: 1 });

        allReviews.forEach(review => {
            review.timeAgo = moment(review.createdAt).fromNow();
        });

        res.locals.allReviews = allReviews;

        res.locals.allCountBlogs = await Blogposts.countDocuments();
        res.locals.allCountActiveBlogs = await Blogposts.countDocuments({status: "Active"});
        res.locals.allCountScheduleBlogs = await Blogposts.countDocuments({publishType: "Schedule"});
        res.locals.allCountContactEnquiries = await ContactQuery.countDocuments();
        res.locals.allCountNewsletter = await Newsletter.countDocuments();
        res.locals.allCountComments = await Blogcomments.countDocuments();

        res.locals.settings = await Setting.findOne();
        res.locals.currentUrl = `${req.protocol}://${req.get('host')}${req.originalUrl}`;
        next();
    } catch (err) {
        next(err);
    }
};

module.exports = frontEndMiddleware;
