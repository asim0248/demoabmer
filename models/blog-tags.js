const mongoose = require('mongoose');
const Schema = mongoose.Schema;
const blogtagsSchema = new Schema({
    tagName: {
        type: String,
        unique: true,
        required: true,
        trim: true
    },
    slug: {
        type: String
    },
    status: {
        type: String,
        enum: ['Active', 'Inactive'],
        default: 'Active'
    }

}, {timestamps: true});

module.exports = mongoose.model('Blogtags', blogtagsSchema);