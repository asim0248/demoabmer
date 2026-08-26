const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const notificationSchema = new Schema({
    title: {
        type: String,
        required: true
    },

    message: {
        type: String,
        required: true
    },

    actionUrl: {
        type: String,
    },

    type: {
        type: String,
        enum: [
            "comment",
            "newsletter",
            "contact",
            "blog-published"
        ]
    },

    referenceId: {
        type: Schema.Types.ObjectId,
        default: null
    },

    referenceModel: {
        type: String,
        default: null
    },

    status: {
        type: String,
        enum: ["Unread", "Read"],
        default: "Unread"
    }

}, {
    timestamps: true
});

module.exports = mongoose.model("Notification", notificationSchema);