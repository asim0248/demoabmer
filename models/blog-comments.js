const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const blogcommentsSchema = new Schema({
    post: {
        type: Schema.Types.ObjectId,
        ref: 'BlogPost',
        required: true
    },
    name: {
        type: String,
        required: true
    },
    email: {
        type: String,
        required: true
    },
    comment: {
        type: String,
        required: true
    },
    ipAddress: {
        type: String
    },
    status: {
        type: String,
        enum: ['Active', 'Inactive'],
        default: 'Inactive'
    }
}, { timestamps: true });

module.exports = mongoose.model('BlogComment', blogcommentsSchema);