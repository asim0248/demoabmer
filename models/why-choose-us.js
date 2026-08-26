const mongoose = require("mongoose");
const Schema = mongoose.Schema;

const imageSchema = new Schema({
    url: String,
    filename: String
}, { _id: false });

const whyFeatureSchema = new Schema({

    title:{
        type:String,
        trim:true
    },

    description:{
        type:String,
        trim:true
    },

    icon:{
        type:String,
        trim:true
    }

},{_id:true});

const whyChooseUsSchema = new Schema({

    smallHeading:String,

    heading:String,

    shortDescription: {
        type: String,
        trim: true
    },

    features:[whyFeatureSchema],

    beforeImage:imageSchema,

    afterImage:imageSchema,

    status:{
        type:String,
        enum:["Active","Inactive"],
        default:"Active"
    }

},{timestamps:true});

module.exports = mongoose.model("WhyChooseUs", whyChooseUsSchema);