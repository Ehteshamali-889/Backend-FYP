const mongoose = require("mongoose");
const Schema=mongoose.Schema;
const AccountSchema=new Schema({
    accname:String,
    accnumber:String
})

const Account=mongoose.model('Account',AccountSchema)
module.exports=Account;
