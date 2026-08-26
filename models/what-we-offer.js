const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const imageSchema = new Schema({
    url: String,
    filename: String
}, { _id: false });

const servicesSchema = new Schema({
    title: {
        type: String,
        required: true
    },
    slug: {
        type: String,
        required: true,
        unique: true
    },
    sortOrder: {
        type: Number,
        default: 0
    },
    serviceIcon: imageSchema,
    serviceDetImg: imageSchema,
    serviceCardImg: imageSchema,
    shortContent: {
        type: String
    },
    metaTitle: {
        type: String
    },
    metaDescription: {
        type: String
    },
    metaKeywords: {
        type: String
    },
    status: {
        type: String,
        enum: ["Active", "Inactive"],
        default: "Active"
    },

    isFeatured: {
        type: String,
        enum: ['Featured', 'Not-Featured'],
        default: 'Not-Featured'
    },
    detailContent: {
        type: String
    }

}, {timestamps: true});

module.exports = mongoose.model('Services', servicesSchema);