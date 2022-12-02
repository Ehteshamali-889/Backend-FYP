const mongoose = require("mongoose");
const Schema=mongoose.Schema;
const ReviewSchema=new Schema({
    subject:String,
    body:String,
    quality:String
})

const Review=mongoose.model('Review',ReviewSchema)
module.exports=Review;
