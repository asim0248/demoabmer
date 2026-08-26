const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const imageSchema = new Schema({
    url: String,
    filename: String
}, { _id: false });

const reviewsSchema = new Schema({
    customerImage: imageSchema,

    customerName: {
        type: String,
        required: true,
        trim: true
    },

    location: {
        type: String,
        required: true,
        trim: true
    },

    reviewText: {
        type: String,
        required: true,
        trim: true
    },

    rating: {
        type: Number,
        required: true,
        min: 1,
        max: 5
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

    sortOrder: {
        type: Number,
        default: 0
    }
}, {
    timestamps: true
});

module.exports = mongoose.model('Reviews', reviewsSchema);