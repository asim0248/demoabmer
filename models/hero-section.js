const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const imageSchema = new Schema({
    url: {
        type: String,
        required: true
    },
    filename: {
        type: String,
        required: true
    }
}, { _id: false });

const heroSectionSchema = new Schema({
    tagLine: {
        type: String,
        trim: true,
        required: true
    },
    heading: {
        type: String,
        required: true,
        trim: true
    },
    paraText: {
        type: String,
        trim: true,
        required: true
    },
    buttonText: {
        type: String,
        trim: true
    },
    buttonLink: {
        type: String,
        trim: true
    },
    sortOrder: {
        type: Number,
        default: 1
    },
    status: {
        type: String,
        enum: ["Active", "Inactive"],
        default: "Active"
    },
    sldImage: {
        url: {
            type: String,
            required: true
        },
        filename: {
            type: String,
            required: true
        }
    }
}, { timestamps: true });

module.exports = mongoose.model('HeroSection', heroSectionSchema);