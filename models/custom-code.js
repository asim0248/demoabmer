const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const customCodeSchema = new Schema({
    headerCode: {
        type: String,
    },
    footerCode: {
        type: String,
    },
    cssCode: {
        type: String
    },
    jsCode: {
        type: String,
    }
}, {
    timestamps: true
});


module.exports = mongoose.model('CustomCode', customCodeSchema);