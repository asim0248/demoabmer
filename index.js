
require('dotenv').config();
// Express framework import
const express = require('express');
const app = express();

// MongoDB ODM
const mongoose = require("mongoose");

//slugify
const slugify = require('slugify');

//moment
const moment = require("moment");

// Path module for folder paths
const path = require('path');

// PUT, DELETE requests support
const methodOverride = require('method-override');

// Session management
const session = require('express-session');

// MongoDB session store
const MongoStore = require('connect-mongo');

// Flash messages
const flash = require('connect-flash');

// Validation library
const Joi = require('joi');

// Authentication
const passport = require('passport');
const LocalStrategy = require('passport-local');

const Cloudinary = require('cloudinary');

// File upload package
const multer = require('multer');
const { storage } = require('./config/CloudConfig');

// Multer configuration
const upload = multer({ storage });

//User model
const User = require('./models/user.js');

//Role model
const Role = require('./models/role.js');

//Custom Code model
const CustomCode = require('./models/custom-code.js');

//Hero Section model
const HeroSection = require('./models/hero-section.js');

//Our Vehicle model
const OurVehicle = require('./models/our-vehicle.js');

//Damage Vehicle model
const DamageVehicle = require('./models/damage-vehicle.js');

//FAQ model
const Faq = require('./models/faq.js');

//Customer Reviews model
const Reviews = require('./models/customer-reviews.js');

//Newsletter model
const Newsletter = require('./models/newsletter.js');

//Services model
const Services = require('./models/what-we-offer.js');

//Pages model
const Pages = require('./models/pages.js');

//Blog Category model
const Blogcategory = require('./models/blog-category.js');

//Blog Tags model
const Blogtags = require('./models/blog-tags.js');

//Blog Posts model
const Blogposts = require('./models/blog-posts.js');

//Blog Comments model
const Blogcomments = require('./models/blog-comments.js');

//Home About Us model
const AboutUs = require('./models/about-us.js');

//About Page About Section model
const AboutUsPage = require('./models/page-about-us.js');

//How It Works Model
const HowItWorks = require('./models/how-it-works.js');

//Why Choose Us model
const WhyChooseUs = require('./models/why-choose-us.js');

// Contact Query Model
const ContactQuery = require('./models/contact-query.js');

// Notification Model
const Notifications = require('./models/notifications.js');

// All Middlewares
const { isLoggedIn, hasPermission } = require('./utils/middlewares.js');

const frontEndMiddleware = require('./utils/pagesMiddleware.js');

//WrapAsync
const WrapAsync = require('./utils/WrapAsync');

//Express Error
const ExpressError = require('./utils/expressError');

//User Controller
const userController = require('./controller/userController.js');

//User Routes
const userRoutes = require('./routes/userRoutes.js');

//change Password Controller
const changePasswordController = require('./controller/changePasswordController.js');

//change Password Routes
const changePasswordRoutes = require('./routes/changePasswordRoutes.js');

//Setting Controller
const settingController = require('./controller/settingController.js');

// Setting Routes
const settingRoutes = require('./routes/settingRoutes.js');

//Role Controller
const roleController = require('./controller/roleController.js');

// Role Routes
const roleRoutes = require('./routes/roleRoutes.js');

//Custom Code Controller
const customCodeController = require('./controller/customCodeController.js');

// Custom Code Routes
const customCodeRoutes = require('./routes/customCodeRoutes.js');

//Employe Controller
const employeeController = require('./controller/employeeController.js');

// Employee Routes
const employeeRoutes = require('./routes/employeeRoutes.js');

//Employe Controller
const heroSectionController = require('./controller/heroSectionController.js');

// Employee Routes
const heroSectionRoutes = require('./routes/heroSectionRoutes.js');

//Our Vehicle Controller
const ourVehicleController = require('./controller/ourVehicleController.js');

// Our Vehicle Routes
const ourVehicleRoutes = require('./routes/ourVehicleRoutes.js');

//Damage Vehicle Controller
const damageVehicleController = require('./controller/damageVhicleController.js');

// Damage Vehicle Routes
const damageVehicleRoutes = require('./routes/damageVehicleRoutes.js');

//Faq Controller
const faqController = require('./controller/faqController.js');

//Faq Routes
const faqRoutes = require('./routes/faqRoutes.js');

//Customer Reviews Controller
const reviewsController = require('./controller/reviewController.js');

//Reviews Routes
const reviewsRoutes = require('./routes/reviewsRoutes.js');

//Newsletter Controller
const newsletterController = require('./controller/newsletterController.js');

//Newsletter Routes
const newsletterRoutes = require('./routes/newsletterRoutes.js');

//Service Controller
const serviceController = require('./controller/whatWeOfferController.js');

//Service Routes
const serviceRoutes = require('./routes/whatWeOfferRoutes.js');

//Pages Controller
const pagesController = require('./controller/pagesController.js');

//Pages Routes
const pagesRoutes = require('./routes/pagesRoutes.js');

//Category Controller
const categoryController = require('./controller/categoryController.js');

//Category Routes
const categoryRoutes = require('./routes/categoryRoutes.js');

//Tags Controller
const tagsController = require('./controller/tagsController.js');

//Tags Routes
const tagRoutes = require('./routes/tagRoutes.js');

//Posts Controller
const postsController = require('./controller/postsController.js');

//Posts Routes
const postsRoutes = require('./routes/postsRoutes.js');

const { toggleStatus, toggleField, toggleHeader, toggleFooter, toggleBlogStatus, toggleReadStatus } = require('./controller/commonStatusController');
const { wrap } = require('module');

const createNotification = require('./helper/notification-helper.js');
const loadNotifications = require("./middlewares/loadNotifications");
const getNotificationStyle = require('./helper/notification-style.js')


const getTransporter = require('./utils/mailer.js');
const whatWeOffer = require('./models/what-we-offer.js');
const blogCategory = require('./models/blog-category.js');
const blogTags = require('./models/blog-tags.js');

// Server port
const PORT = process.env.PORT || 3000;

// MongoDB URL
const DB_URL = process.env.DB_URL;


// ================= DATABASE CONNECTION =================

// MongoDB connect function
async function main() {
    await mongoose.connect(DB_URL);
}

// Connect database
main()
    .then(() => {
        console.log("MongoDB Connection Successful!");

        // Start Blog Scheduler
        require('./cron/blogScheduler');
    })
    .catch((err) => {
        console.log(err);
    });


// ================= SESSION STORE =================

// MongoDB session store
const store = MongoStore.create({
    mongoUrl: DB_URL,

    crypto: {
        secret: process.env.SECRET_CODE,
    },

    // Update session after 24 hours
    touchAfter: 24 * 3600
});

// Session store error handling
store.on("error", (error) => {
    console.log("Session Store Error:", error);
});


// ================= SESSION CONFIG =================

const sessionOptions = {

    secret: "mysecretkey",

    // Avoid saving unchanged session
    resave: false,

    // Don't save empty session
    saveUninitialized: false,

    cookie: {
        // Cookie expiry
        expires: Date.now() + 7 * 24 * 60 * 60 * 1000,

        // Cookie max age = 7 days
        maxAge: 7 * 24 * 60 * 60 * 1000,

        // Security
        httpOnly: true
    }
};

//Pages Middleware
app.use(frontEndMiddleware);

// Notification Middleware
app.use(loadNotifications);

app.use((req, res, next) => {

    res.locals.getNotificationStyle = getNotificationStyle;

    next();

});


// ================= MIDDLEWARES =================

// Session middleware
app.use(session(sessionOptions));

// Flash middleware
app.use(flash());

// Parse form data
app.use(express.urlencoded({ extended: true }));

// Parse JSON data
app.use(express.json());

// Support PUT & DELETE methods
app.use(methodOverride("_method"));

// Static folder
app.use(express.static(path.join(__dirname, 'public')));


// ================= VIEW ENGINE =================

// EJS setup
app.set('view engine', 'ejs');

// Views folder path
app.set('views', path.join(__dirname, 'views'));


// ================= PASSPORT AUTH =================

// Initialize passport
app.use(passport.initialize());

// Use passport session
app.use(passport.session());

// Local authentication strategy
passport.use(new LocalStrategy(User.authenticate()));

// Store user data in session
passport.serializeUser(User.serializeUser());

// Get user from session
passport.deserializeUser(User.deserializeUser());


// ================= GLOBAL VARIABLES =================

// Flash messages & current user available in all templates (Inko Async is kiya hai ky role permissions ko check kr saky har load peer)
app.use(async (req, res, next) => {

    res.locals.success = req.flash('success');
    res.locals.error = req.flash('error');
    res.locals.currentUser = req.user;
    res.locals.customCode = await CustomCode.findOne();
    res.locals.currentUrl = req.originalUrl;

    res.locals.permissions = [];

    if (req.user) {

        const user = await User.findById(req.user._id)
            .populate('role');

        if (user && user.role) {
            res.locals.permissions = user.role.permissions;
        }
    }

    next();
});


// ================= ROUTES =================

//Admin Route
app.get('/admin', (req, res) => {
    res.render('admin/auth/login');
});

//All Admin Routes
app.use(userRoutes);
app.use(changePasswordRoutes);
app.use(settingRoutes);
app.use(roleRoutes);
app.use(customCodeRoutes);
app.use(employeeRoutes);
app.use(heroSectionRoutes);
app.use(ourVehicleRoutes);
app.use(damageVehicleRoutes);
app.use(faqRoutes);
app.use(reviewsRoutes);
app.use(newsletterRoutes);
app.use(serviceRoutes);
app.use(pagesRoutes);
app.use(categoryRoutes);
app.use(tagRoutes);
app.use(postsRoutes);

app.get('/', WrapAsync(async (req, res) => {

    const page = await Pages.findOne({
        slug: 'home',
        status: 'Active'
    });

    if (!page) {
        return res.status(404).render('404');
    }

    res.render('home', {
        currentPage: page
    });

}));

app.get('/:slug', WrapAsync(async (req, res) => {

    const page = await Pages.findOne({
        slug: req.params.slug,
        status: 'Active'
    });

    if (!page) {
        return res.status(404).render('404.ejs');
    }

    switch (page.slug) {

        case '/':
            return res.render('home', {
                currentPage: page,
                title: page.pageName,
            });

        case 'about-us':
            const abWorks = await HowItWorks.find({
                status: 'Active'
            });
            const abWhyChooseUs = await WhyChooseUs.findOne({
                status: 'Active'
            });
            return res.render('about', { currentPage: page, title: page.pageName, abWorks, abWhyChooseUs });

        case 'blog':
            const currentPageNo = parseInt(req.query.page) || 1;
            const limit = 10;
            const skip = (currentPageNo - 1) * limit;

            const totalBlogs = await Blogposts.countDocuments({
                status: 'Active'
            });

            const blogs = await Blogposts.find({
                status: 'Active',
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
            })
                .populate('category')
                .populate('tags')
                .sort({ createdAt: -1 })
                .skip(skip)
                .limit(limit);

            const totalPages = Math.ceil(totalBlogs / limit);

            return res.render('blog', {
                currentPage: page,
                title: page.pageName,
                blogs,
                totalPages,
                currentPageNo
            });

        case 'contact-us':
            const services = await Services.find({
                status: "Active"
            }).sort({ sortOrder: 1 });
            return res.render('contact', { currentPage: page, title: page.pageName, services });

        case 'customer-reviews':
            const pageReviews = await Reviews.find({
                status: "Active",
            }).sort({ sortOrder: 1 });

            pageReviews.forEach(sngReview => {
                sngReview.timeAgo = moment(sngReview.createdAt).fromNow();
            });

            res.locals.pageReviews = pageReviews;
            return res.render('testimonials', { currentPage: page, title: page.pageName, });

        case 'damage-vehicles':
            return res.render('damage-vehicle', { currentPage: page, title: page.pageName, });

        case 'our-vehicles':
            return res.render('our-vehicle', { currentPage: page, title: page.pageName, });

        case 'what-we-offer':
            return res.render('what-we-offer', { currentPage: page, title: page.pageName, });

        case 'faq':
            return res.render('faq', { currentPage: page, title: page.pageName, });

        default:
            return res.render(page.slug, { currentPage: page, title: page.pageName, });

    }

}));

app.get('/blog/:slug', WrapAsync(async (req, res) => {

    res.locals.pageScript = 'blog-detail-web';

    const blog = await Blogposts.findOne({
        slug: req.params.slug,
        status: 'Active',
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
    }).populate('category').populate('tags').populate('author');

    if (!blog) {
        return res.redirect('/404');
    }

    const allBlogComments = await Blogcomments.find({
        post: blog._id,
        status: 'Active'
    }).sort({ createdAt: -1 });

    const recentBlogs = await Blogposts.find({
        status: 'Active',
        _id: { $ne: blog._id }
    })
    .sort({ createdAt: -1 })
    .limit(5);

    // Current blog URL
    const currentUrl = `${req.protocol}://${req.get("host")}${req.originalUrl}`;

    res.render('blog-detail', {
        blog,
        recentBlogs,
        allBlogComments,
        currentUrl,      // <-- Ye add karna hai
        title: blog.blogTitle,
        currentPage: {
            metaTitle: blog.metaTitle,
            metaDescription: blog.metaDescription,
            metaKeywords: blog.metaKeywords
        }
    });

}));

app.get('/blog/category/:slug', WrapAsync(async (req, res) => {

    const category = await blogCategory.findOne({
        slug: req.params.slug,
        status: 'Active'
    });

    if (!category) {
        return res.status(404).render('404');
    }

    const blogs = await Blogposts.find({
        category: category._id,
        status: 'Active'
    })
        .populate('category').populate('author')
        .sort({ createdAt: -1 });

    res.render('blog-category', { blogs, category, title: category.categoryName });
}));

app.get('/blog/tag/:slug', WrapAsync(async (req, res) => {

    const tags = await blogTags.findOne({
        slug: req.params.slug,
        status: 'Active'
    });

    if (!tags) {
        return res.status(404).render('404');
    }

    const blogs = await Blogposts.find({
        tags: tags._id,
        status: 'Active'
    })
        .populate('tags').populate('author').populate('category')
        .sort({ createdAt: -1 });

    res.render('blog-tag', { blogs, tags, title: tags.tagName });
}));

app.get('/services/:slug', WrapAsync(async (req, res) => {

    const singleServices = await whatWeOffer.findOne({
        slug: req.params.slug,
        status: 'Active'
    });

    if (!singleServices) {
        return res.redirect('/404');
    }

    res.render('service-details', {
        singleServices,
        title: singleServices.title,
        currentPage: {
            metaTitle: singleServices.metaTitle,
            metaDescription: singleServices.metaDescription,
            metaKeywords: singleServices.metaKeywords
        }
    });
}));

app.get('/:slug', WrapAsync(async (req, res) => {

    const currentPage = await Pages.findOne({
        slug: req.params.slug,
        status: 'Active'
    });

    if (!currentPage) {
        return res.status(404).render('404');
    }

    res.render('page', {
        currentPage,
        title: currentPage.pageName,
    });

}));

app.get('/api/blog-search', WrapAsync(async (req, res) => {

    const keyword = req.query.q;

    if (!keyword) {
        return res.json([]);
    }

    const blogs = await Blogposts.find({
        blogTitle: {
            $regex: keyword,
            $options: 'i'
        },
        status: 'Active'
    })
        .select('blogTitle slug')
        .limit(5);

    res.json(blogs);
}));

//Logout Route
app.get('/admin/logout', (req, res, next) => {

    req.logout((err) => {

        if (err) {
            return next(err);
        }

        req.flash("success", "Logged out successfully");

        res.redirect('/admin/login');
    });

});

//===== Blog Comments Start====

app.get('/admin/blog/blog-comments', isLoggedIn, hasPermission('blog-posts'), WrapAsync(async (req, res) => {
    const allComments = await Blogcomments.find().populate('post').sort({ createAt: -1 });
    res.render('admin/blog-comments/view', { allComments });
}));

app.post('/blog/comment', WrapAsync(async (req, res) => {

    let { postId, name, email, slug, comment } = req.body;

    name = name.trim();
    email = email.trim();
    comment = comment.trim();

    if (!postId || !name || !email || !comment) {
        req.flash('error', 'All fields are required');
        return res.redirect(`/blog/${slug}`);
    }
    let newComment = new Blogcomments({
        post: postId,
        name,
        email,
        comment,
        ipAddress: req.ip
    });
    await newComment.save();
    const blog = await Blogposts.findById(postId);
    await createNotification(
        "New Comment Received",
        `${newComment.name} commented on "${blog.blogTitle}"`,
        "comment",
        newComment._id,
        "Comment",
        `/admin/blog/blog-comments/${newComment._id}/show`
    );

    req.flash(
        'success',
        'Comment submitted successfully and awaiting approval.'
    );

    res.redirect(`/blog/${slug}`);

}));

app.get('/admin/blog/blog-comments/:id/show', isLoggedIn, hasPermission('blog-posts'), WrapAsync(async (req, res) => {
    const showBlogComment = await Blogcomments.findById(req.params.id).populate('post');
    res.render('admin/blog-comments/show', { showBlogComment });
}));

app.delete('/admin/blog/blog-comments/:id', isLoggedIn, hasPermission('blog-posts'), WrapAsync(async (req, res) => {
    const deleteComment = await Blogcomments.findById(req.params.id);

    if (!deleteComment) {
        req.flash('error', 'Comment Not Found');
        return res.redirect('/admin/blog/blog-comments');
    }
    await deleteComment.deleteOne();

    req.flash('success', 'Comment Deleted Successfully');

    return res.redirect('/admin/blog/blog-comments');
}));

//Status Change Route
app.post('/admin/blog/blog-comments/:id/toggle-status',
    isLoggedIn,
    hasPermission('blog-comments'),
    toggleStatus(Blogcomments)
);

//===== Blog Comments End====

//==== Home About Us Section Routes Starts====
app.get('/admin/about-us-section', isLoggedIn, hasPermission('about-us-section'), WrapAsync(async (req, res) => {
    const aboutSection = await AboutUs.findOne();
    res.render('admin/about-us-section/view', { aboutSection })
}));
app.get('/admin/about-us-section/edit', isLoggedIn, hasPermission('about-us-section'), WrapAsync(async (req, res) => {
    const editAboutSection = await AboutUs.findOne();
    res.locals.pageScript = 'about-us-section';
    res.render('admin/about-us-section/edit', { editAboutSection })
}));

app.post(
    "/admin/about-us-section",
    isLoggedIn,
    hasPermission("about-us-section"),
    upload.fields([
        { name: "mainImage", maxCount: 1 },
        { name: "secondImage", maxCount: 1 },
        { name: "featureIcon", maxCount: 20 }
    ]),
    WrapAsync(async (req, res) => {

        let aboutSection = await AboutUs.findOne();

        if (!aboutSection) {
            aboutSection = new AboutUs();
        }

        // =========================
        // Basic Fields
        // =========================

        aboutSection.smallHeading = req.body.smallHeading;
        aboutSection.heading = req.body.heading;
        aboutSection.description = req.body.description;
        aboutSection.experienceYear = req.body.experienceYear;
        aboutSection.experienceText = req.body.experienceText;
        aboutSection.buttonText = req.body.buttonText;
        aboutSection.buttonLink = req.body.buttonLink;
        aboutSection.reviewText = req.body.reviewText;
        aboutSection.videoLink = req.body.videoLink;

        // =========================
        // Images
        // =========================
        if (req.files.mainImage) {
            aboutSection.mainImage = {
                url: req.files.mainImage[0].path,
                filename: req.files.mainImage[0].filename
            };
        }

        if (req.files.secondImage) {
            aboutSection.secondImage = {
                url: req.files.secondImage[0].path,
                filename: req.files.secondImage[0].filename
            };
        }

        // =========================
        // Features Logic
        // =========================

        const titles = Array.isArray(req.body.featureTitle)
            ? req.body.featureTitle
            : [req.body.featureTitle];

        const descriptions = Array.isArray(req.body.featureDescription)
            ? req.body.featureDescription
            : [req.body.featureDescription];

        const icons = Array.isArray(req.body.featureIcon)
            ? req.body.featureIcon
            : [req.body.featureIcon];

        aboutSection.features = [];

        for (let i = 0; i < titles.length; i++) {

            if (!titles[i] || titles[i].trim() === "") {
                continue;
            }

            aboutSection.features.push({
                title: titles[i],
                description: descriptions[i],
                icon: icons[i]
            });

        }

        // =========================

        await aboutSection.save();

        req.flash("success", "About Section Saved Successfully");
        res.redirect("/admin/about-us-section");

    })
);

//Status Change Route
app.post(
    "/admin/about-us-section/toggle-status",
    isLoggedIn,
    hasPermission("about-us-section"),
    WrapAsync(async (req, res) => {

        const aboutSection = await AboutUs.findOne();

        if (!aboutSection) {
            return res.status(404).json({
                success: false,
                message: "About section not found"
            });
        }

        aboutSection.status =
            aboutSection.status === "Active"
                ? "Inactive"
                : "Active";

        await aboutSection.save();

        res.json({
            success: true,
            status: aboutSection.status
        });

    })
);
//==== Home About Us Section Routes End====


//==== About Page About Us Section Routes Starts====
app.get('/admin/about-us-page-section', isLoggedIn, hasPermission('about-us-page-section'), WrapAsync(async (req, res) => {
    const pageAboutSection = await AboutUsPage.findOne();
    res.render('admin/about-us-page-section/view', { pageAboutSection })
}));
app.get('/admin/about-us-page-section/edit', isLoggedIn, hasPermission('about-us-page-section'), WrapAsync(async (req, res) => {
    const pageEditAboutSection = await AboutUsPage.findOne();
    res.locals.pageScript = 'about-us-page-section';
    res.render('admin/about-us-page-section/edit', { pageEditAboutSection })
}));

app.post(
    "/admin/about-us-page-section",
    isLoggedIn,
    hasPermission("about-us-page-section"),
    upload.fields([
        { name: "mainImage", maxCount: 1 },
        { name: "secondImage", maxCount: 1 },
    ]),
    WrapAsync(async (req, res) => {

        let pageAboutSection = await AboutUsPage.findOne();

        if (!pageAboutSection) {
            pageAboutSection = new AboutUsPage();
        }

        // =========================
        // Basic Fields
        // =========================

        pageAboutSection.smallHeading = req.body.smallHeading;
        pageAboutSection.heading = req.body.heading;
        pageAboutSection.description = req.body.description;
        pageAboutSection.experienceYear = req.body.experienceYear;
        pageAboutSection.experienceText = req.body.experienceText;
        // =========================
        // Images
        // =========================
        if (req.files.mainImage) {
            pageAboutSection.mainImage = {
                url: req.files.mainImage[0].path,
                filename: req.files.mainImage[0].filename
            };
        }

        if (req.files.secondImage) {
            pageAboutSection.secondImage = {
                url: req.files.secondImage[0].path,
                filename: req.files.secondImage[0].filename
            };
        }

        // =========================
        // Features Logic
        // =========================

        const titles = Array.isArray(req.body.featureTitle)
            ? req.body.featureTitle
            : [req.body.featureTitle];

        pageAboutSection.features = [];

        for (let i = 0; i < titles.length; i++) {

            if (!titles[i] || titles[i].trim() === "") {
                continue;
            }

            pageAboutSection.features.push({
                title: titles[i],
            });

        }

        // =========================

        await pageAboutSection.save();

        req.flash("success", "About Section Saved Successfully");
        res.redirect("/admin/about-us-page-section");

    })
);

//Status Change Route
app.post(
    "/admin/about-us-page-section/toggle-status",
    isLoggedIn,
    hasPermission("about-us-page-section"),
    WrapAsync(async (req, res) => {

        const pageAboutSection = await AboutUsPage.findOne();

        if (!pageAboutSection) {
            return res.status(404).json({
                success: false,
                message: "About section not found"
            });
        }

        pageAboutSection.status =
            pageAboutSection.status === "Active"
                ? "Inactive"
                : "Active";

        await pageAboutSection.save();

        res.json({
            success: true,
            status: pageAboutSection.status
        });

    })
);
//==== About Page About Us Section Routes End====


//==== How We Works Routes Starts====

// Render View Route
app.get(
    "/admin/how-it-works",
    isLoggedIn,
    hasPermission("how-it-works"),
    WrapAsync(async (req, res) => {

        const allWorks = await HowItWorks.find();

        res.render("admin/how-it-works/view", {
            allWorks
        });

    })
);

// Render Add Route
app.get(
    "/admin/how-it-works/add",
    isLoggedIn,
    hasPermission("how-it-works"),
    (req, res) => {

        res.render("admin/how-it-works/add");

    }
);

//Render Edit Page Route
app.get(
    "/admin/how-it-works/:id/edit",
    isLoggedIn,
    hasPermission("how-it-works"),
    WrapAsync(async (req, res) => {

        const signleWork = await HowItWorks.findById(req.params.id);

        res.render("admin/how-it-works/edit", {
            signleWork
        });

    })
);

//Add New Work Route
app.post(
    "/admin/how-it-works/add",
    isLoggedIn,
    hasPermission("how-it-works"),
    upload.fields([
        {
            name: "icon",
            maxCount: 1,
        },
        {
            name: "backgroundImage",
            maxCount: 1,
        },
    ]),
    WrapAsync(async (req, res) => {

        const {
            title,
            description,
        } = req.body;

        if (!title) {
            req.flash('error', 'Title is Required');
            return res.redirect('/admin/how-it-works/add');
        }

        if (!description) {
            req.flash('error', 'Description is Required');
            return res.redirect('/admin/how-it-works/add');
        }

        const newItem = new HowItWorks({

            title,
            description,

        });

        if (req.files.icon) {

            newItem.icon = {
                url: req.files.icon[0].path,
                filename: req.files.icon[0].filename,
            };

        }

        if (!req.files.icon) {
            req.flash('error', 'Icon Image is Required');
            return res.redirect('/admin/how-it-works/add');
        }

        if (req.files.backgroundImage) {

            newItem.backgroundImage = {
                url: req.files.backgroundImage[0].path,
                filename: req.files.backgroundImage[0].filename,
            };

        }

        if (!req.files.backgroundImage) {
            req.flash('error', 'background Image is Required');
            return res.redirect('/admin/how-it-works/add');
        }

        await newItem.save();

        req.flash("success", "Work added successfully.");

        res.redirect("/admin/how-it-works");

    })
);

// Update Work Route
app.put(
    "/admin/how-it-works/:id",
    isLoggedIn,
    hasPermission("how-it-works"),
    upload.fields([
        {
            name: "icon",
            maxCount: 1,
        },
        {
            name: "backgroundImage",
            maxCount: 1,
        },
    ]),
    WrapAsync(async (req, res) => {

        const { id } = req.params;

        const {
            title,
            description,
        } = req.body;

        const singleWork = await HowItWorks.findById(id);

        if (!singleWork) {
            req.flash("error", "Record not found.");
            return res.redirect("/admin/how-it-works");
        }

        singleWork.title = title;
        singleWork.description = description;

        // Update Icon
        if (req.files.icon) {

            if (singleWork.icon && singleWork.icon.filename) {
                await cloudinary.uploader.destroy(singleWork.icon.filename);
            }

            singleWork.icon = {
                url: req.files.icon[0].path,
                filename: req.files.icon[0].filename,
            };

        }

        // Update Background Image
        if (req.files.backgroundImage) {

            if (
                singleWork.backgroundImage &&
                singleWork.backgroundImage.filename
            ) {
                await cloudinary.uploader.destroy(
                    singleWork.backgroundImage.filename
                );
            }

            singleWork.backgroundImage = {
                url: req.files.backgroundImage[0].path,
                filename: req.files.backgroundImage[0].filename,
            };

        }

        await singleWork.save();

        req.flash("success", "How It Works updated successfully.");

        res.redirect("/admin/how-it-works");

    })
);

// Delete Work Route
app.delete(
    "/admin/how-it-works/:id",
    isLoggedIn,
    hasPermission("how-it-works"),
    WrapAsync(async (req, res) => {

        const { id } = req.params;

        const singleWork = await HowItWorks.findById(id);

        if (!singleWork) {
            req.flash("error", "Record not found.");
            return res.redirect("/admin/how-it-works");
        }

        // Delete Icon
        if (singleWork.icon && singleWork.icon.filename) {
            await Cloudinary.uploader.destroy(singleWork.icon.filename);
        }

        // Delete Background Image
        if (
            singleWork.backgroundImage &&
            singleWork.backgroundImage.filename
        ) {
            await Cloudinary.uploader.destroy(
                singleWork.backgroundImage.filename
            );
        }

        await HowItWorks.findByIdAndDelete(id);

        req.flash("success", "How It Works deleted successfully.");

        res.redirect("/admin/how-it-works");

    })
);

//Status Change Route
app.post('/admin/how-it-works/:id/toggle-status',
    isLoggedIn,
    hasPermission('how-it-works'),
    toggleStatus(HowItWorks)
);
//==== How We Works Routes Ends====

//==== Why Choose Us Routes Starts====
app.get('/admin/why-choose-us', isLoggedIn, hasPermission('why-choose-us'), WrapAsync(async (req, res) => {
    const whyChooseUsSection = await WhyChooseUs.findOne();
    res.render('admin/why-choose-us/view', { whyChooseUsSection })
}));
app.get('/admin/why-choose-us/edit', isLoggedIn, hasPermission('why-choose-us'), WrapAsync(async (req, res) => {
    const editWhyChooseUsSection = await WhyChooseUs.findOne();
    res.locals.pageScript = 'why-choose-us';
    res.render('admin/why-choose-us/edit', { editWhyChooseUsSection })
}));

app.post(
    "/admin/why-choose-us",
    isLoggedIn,
    hasPermission("why-choose-us"),
    upload.fields([
        { name: "beforeImage", maxCount: 1 },
        { name: "afterImage", maxCount: 1 },
    ]),
    WrapAsync(async (req, res) => {

        let whyChooseUsSection = await WhyChooseUs.findOne();

        if (!whyChooseUsSection) {
            whyChooseUsSection = new WhyChooseUs();
        }

        // =========================
        // Basic Fields
        // =========================

        whyChooseUsSection.smallHeading = req.body.smallHeading;
        whyChooseUsSection.heading = req.body.heading;
        whyChooseUsSection.shortDescription = req.body.shortDescription;

        // =========================
        // Images
        // =========================
        if (req.files.beforeImage) {
            whyChooseUsSection.beforeImage = {
                url: req.files.beforeImage[0].path,
                filename: req.files.beforeImage[0].filename
            };
        }

        if (req.files.afterImage) {
            whyChooseUsSection.afterImage = {
                url: req.files.afterImage[0].path,
                filename: req.files.afterImage[0].filename
            };
        }

        // =========================
        // Features Logic
        // =========================

        const titles = Array.isArray(req.body.featureTitle)
            ? req.body.featureTitle
            : [req.body.featureTitle];

        const descriptions = Array.isArray(req.body.featureDescription)
            ? req.body.featureDescription
            : [req.body.featureDescription];

        const icons = Array.isArray(req.body.featureIcon)
            ? req.body.featureIcon
            : [req.body.featureIcon];

        whyChooseUsSection.features = [];

        for (let i = 0; i < titles.length; i++) {

            if (!titles[i] || titles[i].trim() === "") {
                continue;
            }

            whyChooseUsSection.features.push({
                title: titles[i],
                description: descriptions[i],
                icon: icons[i]
            });

        }

        // =========================
        await whyChooseUsSection.save();

        req.flash("success", "Why Choose Us Section Saved Successfully");
        res.redirect("/admin/why-choose-us");

    })
);

//Status Change Route
app.post(
    "/admin/why-choose-us/toggle-status",
    isLoggedIn,
    hasPermission("why-choose-us"),
    WrapAsync(async (req, res) => {

        const whyChooseUsSection = await WhyChooseUs.findOne();

        if (!whyChooseUsSection) {
            return res.status(404).json({
                success: false,
                message: "Why Choose Us section not found"
            });
        }

        whyChooseUsSection.status =
            whyChooseUsSection.status === "Active"
                ? "Inactive"
                : "Active";

        await whyChooseUsSection.save();

        res.json({
            success: true,
            status: whyChooseUsSection.status
        });

    })
);
//==== Why Choose Us Routes End====

//==== Contact Query Routes Start====
app.get('/admin/contact-query', isLoggedIn, hasPermission('contact-query'), WrapAsync(async (req, res) => {
    const allEnquiries = await ContactQuery.find();
    res.render('admin/contact-query/view', { allEnquiries });
}));

app.get('/admin/contact-query/:id/show', isLoggedIn, hasPermission('contact-query'), WrapAsync(async (req, res) => {
    const sngEnquiries = await ContactQuery.findById(req.params.id).populate("service");
    res.render('admin/contact-query/show', { sngEnquiries });
}));

app.post("/contact", WrapAsync(async (req, res) => {

    const {
        fullname,
        email,
        phone,
        subject,
        service,
        message
    } = req.body;

    if (!fullname) {
        req.flash("error", "Full Name is required.");
        return res.redirect("/contact-us");
    }

    if (!email) {
        req.flash("error", "Email is required.");
        return res.redirect("/contact-us");
    }

    if (!phone) {
        req.flash("error", "Phone is required.");
        return res.redirect("/contact-us");
    }

    if (!service) {
        req.flash("error", "Service is required.");
        return res.redirect("/contact-us");
    }

    const notifyContact = await ContactQuery.create({
        fullname,
        email,
        phone,
        subject,
        service,
        message
    });

    const transporter = await getTransporter();
    const selectedService = await Services.findById(service);

    await transporter.sendMail({

        from: '"Amber Accident Claims Management" <info@mubeentraders.com>',

        to: "info@mubeentraders.com",

        subject: "New Contact Enquiry",

        html: `
        <h2>New Contact Enquiry</h2>

        <p><strong>Name:</strong> ${fullname}</p>

        <p><strong>Email:</strong> ${email}</p>

        <p><strong>Phone:</strong> ${phone}</p>

        <p><strong>Service:</strong> ${selectedService.title}</p>

        <p><strong>Subject:</strong> ${subject}</p>

        <p><strong>Message:</strong></p>

        <p>${message}</p>
    `

    });

    await transporter.sendMail({

        from: '"Amber Accident Claims Management" <info@mubeentraders.com>',

        to: email,

        subject: "Thank you for contacting us",

        html: `
        <h2>Thank You ${fullname}</h2>

        <p>We have received your enquiry.</p>

        <p>Our team will contact you shortly.</p>
    `
    });
    await createNotification(
        "New Contact Query",
        `${notifyContact.fullname} submitted a query`,
        "contact",
        notifyContact._id,
        "Contact",
        `/admin/contact-query/${notifyContact._id}/show`
        
    );
    req.flash('success', 'Your Message Has Been Submitted Successfully!');
    res.redirect('/contact-us');
}));

app.delete("/admin/contact-query/:id",
    isLoggedIn,
    hasPermission("contact-query"),
    WrapAsync(async (req, res) => {

        const { id } = req.params;

        const query = await ContactQuery.findById(id);

        if (!query) {
            req.flash("error", "Query not found.");
            return res.redirect("/admin/contact-query");
        }

        await ContactQuery.findByIdAndDelete(id);

        req.flash("success", "Contact query deleted successfully.");

        res.redirect("/admin/contact-query");

    }));
//Status Change Route
app.post('/admin/contact-query/:id/toggle-read-status',
    isLoggedIn,
    hasPermission('contact-query'),
    toggleReadStatus(ContactQuery)
);

//Export All Queries
app.get('/admin/contact-query/export-csv', isLoggedIn, hasPermission('contact-query'), WrapAsync(async (req, res) => {

    const enquiries = await ContactQuery.find()
        .populate("service")
        .sort({ createdAt: -1 });

    let csv = 'Name,Email,Phone,Subject,Service,Message,Submitted Date\n';

    enquiries.forEach(item => {

        const date = item.createdAt.toLocaleString('en-PK', {
            year: 'numeric',
            month: 'short',
            day: 'numeric',
            hour: '2-digit',
            minute: '2-digit'
        });

        csv += `"${item.fullname}","${item.email}","${item.phone}","${item.subject || ''}","${item.service ? item.service.title : ''}","${item.message || ''}","${date}"\n`;

    });

    res.setHeader(
        'Content-Disposition',
        'attachment; filename=contact-enquiries.csv'
    );

    res.setHeader('Content-Type', 'text/csv');

    return res.send(csv);

}));

//Export Today Queries
app.get('/admin/contact-query/export-today-csv',
    isLoggedIn,
    hasPermission('contact-query'),
    WrapAsync(async (req, res) => {

        const start = new Date();
        start.setHours(0, 0, 0, 0);

        const end = new Date();
        end.setHours(23, 59, 59, 999);

        const enquiries = await ContactQuery.find({
            createdAt: {
                $gte: start,
                $lte: end
            }
        })
            .populate("service")
            .sort({ createdAt: -1 });

        let csv = 'Name,Email,Phone,Subject,Service,Message,Status,Submitted Date\n';

        enquiries.forEach(item => {

            const date = item.createdAt.toLocaleString('en-PK', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });

            csv += `"${item.fullname}","${item.email}","${item.phone}","${item.subject || ''}","${item.service ? item.service.title : ''}","${item.message || ''}","${item.status}","${date}"\n`;

        });

        res.setHeader(
            'Content-Disposition',
            'attachment; filename=today-contact-enquiries.csv'
        );

        res.setHeader('Content-Type', 'text/csv');

        return res.send(csv);

    }));

//Export Date Wise Queries
app.get('/admin/contact-query/export-date-csv',
    isLoggedIn,
    hasPermission('contact-query'), WrapAsync(async (req, res) => {

        const { fromDate, toDate } = req.query;

        if (!fromDate || !toDate) {
            req.flash("error", "Please select both From Date and To Date.");
            return res.redirect("/admin/contact-query");
        }

        const startDate = new Date(fromDate);
        startDate.setHours(0, 0, 0, 0);

        const endDate = new Date(toDate);
        endDate.setHours(23, 59, 59, 999);

        const enquiries = await ContactQuery.find({
            createdAt: {
                $gte: startDate,
                $lte: endDate
            }
        })
            .populate("service")
            .sort({ createdAt: -1 });

        let csv = 'Name,Email,Phone,Subject,Service,Message,Status,Submitted Date\n';

        enquiries.forEach(item => {

            const date = item.createdAt.toLocaleString('en-PK', {
                year: 'numeric',
                month: 'short',
                day: 'numeric',
                hour: '2-digit',
                minute: '2-digit'
            });

            csv += `"${item.fullname}","${item.email}","${item.phone}","${item.subject || ''}","${item.service ? item.service.title : ''}","${item.message || ''}","${item.status}","${date}"\n`;

        });

        res.setHeader(
            'Content-Disposition',
            `attachment; filename=contact-enquiries-${fromDate}-to-${toDate}.csv`
        );

        res.setHeader('Content-Type', 'text/csv');

        return res.send(csv);

    }));
//==== Contact Query Routes End====

//==== Notification Routes Startd ====

app.get('/admin/notifications', isLoggedIn, hasPermission('notifications'), WrapAsync(async(req, res) => {
    const allNotifications = await Notifications.find().sort({ createdAt: -1 });
    res.render('admin/notifications/view', {allNotifications})
}));

app.delete("/admin/notifications/:id", WrapAsync( async (req, res) => {
    try {
        const { id } = req.params;

        await Notifications.findByIdAndDelete(id);

        req.flash("success", "Notification deleted successfully.");
        res.redirect("/admin/notifications");

    } catch (err) {
        console.error(err);
        req.flash("error", "Something went wrong.");
        res.redirect("/admin/notifications");
    }
}));

app.get("/admin/notifications/:id/view", WrapAsync(async (req, res) => {

    const notification = await Notifications.findById(req.params.id);

    if (!notification) {
        req.flash("error", "Notification not found.");
        return res.redirect("/admin/notifications");
    }

    // Unread ho to Read kar do
    if (notification.status === "Unread") {
        notification.status = "Read";
        await notification.save();
    }

    // Agar actionUrl exist nahi karti
    if (!notification.actionUrl) {
        req.flash("error", "Notification URL not found.");
        return res.redirect("/admin/notifications");
    }

    // Original module par redirect
    return res.redirect(notification.actionUrl);

}));
//Status Change Route
app.post('/admin/notifications/:id/toggle-read-status',
    isLoggedIn,
    hasPermission('notifications'),
    toggleReadStatus(Notifications)
);


//==== Notification Routes End ====

//Global Error Handling
app.use((req, res, next) => {
    next(
        new ExpressError(
            404,
            'Page Not Found'
        )
    );
});

//Error Handling Middleware
app.use((err, req, res, next) => {
    let { statusCode = 500, message = "Something Went Wrong" } = err;

    //  console.log(err);
    //  console.error(err.stack);

    res.status(statusCode).render('admin/error', {
        message
    });
});

// ================= SERVER =================

// Start server
app.listen(PORT,'0.0.0.0', () => {
    console.log(`Server is running on port ${PORT}`);
});
