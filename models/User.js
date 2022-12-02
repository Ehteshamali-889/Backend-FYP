const mongoose = require("mongoose");
const Schema=mongoose.Schema;
const UserSchema=new Schema({
    name:String,
    email:String,
    password:String,
    avatar:Buffer,
    picname: String,
    img: {
        data: Buffer,
        contentType: String,
    },
})

const User=mongoose.model('User',UserSchema)
module.exports=User;
