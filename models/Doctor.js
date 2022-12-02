const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const DoctorSchema = new Schema({
  name: String,
  email: String,
  password: String,
  experience:String,
  speciality:String,
  price:String
});

const Doctor = mongoose.model("Doctor", DoctorSchema);
module.exports = Doctor;
