const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const AppointmentSchema = new Schema({
  namedoctor: String,
  date: String,
  time: String,
  description:String,
  completed:String,
  patientid:String,
  doctorid: String,
  price:String,
  paid:String,
  patientname:String
});

const Appointment = mongoose.model("Appointment", AppointmentSchema);
module.exports = Appointment;
