const mongoose = require('mongoose');
const Schema = mongoose.Schema;


const pagesSchema = new Schema({
    pageName: {
        type: String,
        required: true,
        unique: true,
    },
    slug: {
        type: String,
        required: true,
        unique: true,
    },
    menuOrder: {
        type: Number,
        default: 0
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
        default: 'Active'
    },
    isHeader: {
        type: String,
        enum: ["Yes", "No"],
        default: 'No'
    },
    isFooter: {
        type: String,
        enum: ["Yes", "No"],
        default: 'No'
    },
    pageContent: {
        type: String
    },
    sectionTagLine: {
        type: String
    },
    sectionHeading: {
        type: String
    }

}, {timestamps: true});

module.exports = mongoose.model('Pages', pagesSchema);