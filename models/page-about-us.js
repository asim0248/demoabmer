const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const imageSchema = new Schema({
    url: String,
    filename: String
}, { _id: false });

const featureSchema = new Schema({

    title:{
        type:String,
        trim:true
    },

},{_id:true});

const aboutUsPageSchema = new Schema({

    smallHeading:String,

    heading:String,

    description:String,

    features:[featureSchema],

    experienceYear:Number,

    experienceText:String,

    mainImage:imageSchema,

    secondImage:imageSchema,

    status:{
        type:String,
        enum:["Active","Inactive"],
        default:"Active"
    }

},{timestamps:true});

module.exports = mongoose.model("AboutUsPage", aboutUsPageSchema);