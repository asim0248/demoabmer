const cron = require("node-cron");
const Blogposts = require("../models/blog-posts");
// Notification Model
const Notifications = require('../models/notifications.js');

const createNotification = require('../helper/notification-helper.js');
const loadNotifications = require("../middlewares/loadNotifications");
const getNotificationStyle = require('../helper/notification-style.js')

cron.schedule("* * * * *", async () => {

    try {

        const blogs = await Blogposts.find({
            publishType: "Schedule",
            publishDate: { $lte: new Date() }
        });

        for (const blog of blogs) {

            blog.publishType = "Publish";

            await blog.save();

            await createNotification(
                "Blog Published",
                `"${blog.blogTitle}" has been published.`,
                "blog-published",
                blog._id,
                "Blog",
                `/admin/blog/posts/${blog._id}/edit`
            );

            console.log(`${blog.blogTitle} published successfully.`);
        }

    } catch (err) {
        console.log(err);
    }

});

console.log("Blog Scheduler Started...");