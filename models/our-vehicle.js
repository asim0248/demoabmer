const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const ourVehicleSchema = new Schema({
    vehicleImage: {
        url: {
            type: String,
            required: true
        },
        filename: {
            type: String,
            required: true
        }
    },
    altText: {
        type: String,
        trim: true
    },
    sortOrder: {
        type: Number,
        default: 0
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
    }

}, {
    timestamps: true
});

module.exports = mongoose.model('OurVehicle', ourVehicleSchema);