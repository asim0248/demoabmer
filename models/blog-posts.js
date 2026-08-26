
const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const imageSchema = new Schema({
    url: String,
    filename: String
}, { _id: false });

const blogPostSchema = new Schema({
    blogTitle: {
        type: String,
        required: true,
        trim: true
    },
    slug: {
        type: String,
        required: true,
        unique: true,
        lowercase: true,
        trim: true
    },
    shortContent: {
        type: String
    },
    sortOrder: {
        type: Number,
        default: 0
    },
    category: [{
        type: Schema.Types.ObjectId,
        ref: 'Blogcategory',
        required: true
    }],
    tags: [{
        type: Schema.Types.ObjectId,
        ref: 'Blogtags'
    }],
    author: {
        type: Schema.Types.ObjectId,
        ref: 'User' // ya User model ka naam
    },
    metaTitle: {
        type: String
    },
    metaKeywords: {
        type: String
    },
    metaDescription: {
        type: String
    },
    detailContent: {
        type: String
    },
    isFeatured: {
        type: String,
        enum: ['Featured', 'Not-Featured'],
        default: 'Not-Featured'
    },
    status: {
        type: String,
        enum: ['Active', 'Inactive'],
        default: 'Active'
    },
    publishType: {
        type: String,
        enum: ['Publish', 'Schedule'],
        default: 'Publish'
    },
    publishDate: {
        type: Date,
        default: null
    },
    featureImage: imageSchema,
    detailImage: imageSchema

}, { timestamps: true });

module.exports = mongoose.model('BlogPost', blogPostSchema);