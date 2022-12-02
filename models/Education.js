const mongoose = require("mongoose");
const Schema=mongoose.Schema;
const EducationSchema=new Schema({
    name:String,
    year:String,
    country:String,
    grade:String,
    doctor:String
})

const Education=mongoose.model('Education',EducationSchema)
module.exports=Education;
