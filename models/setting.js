const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const imageSchema = new Schema({
    url: String,
    filename: String
}, { _id: false });

const settingSchema = new Schema({

    //General Settings
    websitename: {
        type: String
    },
    websiteurl: {
        type: String
    },
    primarycolor: {
        type: String
    },
    secondarycolor: {
        type: String
    },
    websitelogo: imageSchema,
    websitewhitelogo: imageSchema,
    adminlogo: imageSchema,
    websitefavicon: imageSchema,
    websiteadminfavicon: imageSchema,
    sidebarabouttext: {
        type: String,
    },
    footerabouttext: {
        type: String,
    },
    footercopytext: {
        type: String,
    },
    contactpagetext: {
        type: String,
    },
    googleMapEmbedUrl: {
        type: String
    },

    //Contact Seetinga
    email: {
        type: String,
    },
    phonenumber: {
        type: String,
    },
    address: {
        type: String,
    },
    officetiming: {
        type: String,
    },

    //Social Media Settings
    facebook: {
        type: String,
    },
    twitter: {
        type: String,
    },
    linkedin: {
        type: String,
    },
    instagram: {
        type: String,
    },

    // SMTP Settings
    smtpDriver: {
        type: String
    },
    smtpHost: {
        type: String
    },
    smtpPort: {
        type: Number
    },
    smtpusername: {
        type: String
    },
    smtppassword: {
        type: String
    },
    fromemail: {
        type: String
    },
    fromname: {
        type: String
    }

});

module.exports = mongoose.model('Setting', settingSchema);