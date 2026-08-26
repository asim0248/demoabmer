const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const contactQuerySchema = new Schema({
    fullname: {
        type: String,
        required: true,
        trim: true
    },

    email: {
        type: String,
        required: true,
        lowercase: true,
        trim: true
    },

    phone: {
        type: String,
        required: true,
        trim: true
    },

    subject: {
        type: String,
        trim: true
    },

    service: {
        type: Schema.Types.ObjectId,
        ref: "Services",
        required: true
    },

    message: {
        type: String,
        trim: true
    },

    status: {
        type: String,
        enum: ["Unread", "Read"],
        default: "Unread"
    }

}, {
    timestamps: true
});

module.exports = mongoose.model("ContactQuery", contactQuerySchema);