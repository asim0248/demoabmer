const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const blogcategorySchema = new Schema({
    categoryName: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    slug: {
        type: String,
        unique: true,
        required: true,
        trim: true
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
        enum: ['Active', 'Inactive'],
        default: 'Active'
    }

}, {timestamps: true});

module.exports = mongoose.model('Blogcategory', blogcategorySchema);