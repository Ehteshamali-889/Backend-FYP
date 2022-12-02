const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const PatientSchema = new Schema({
  name: String,
  email: String,
  password: String
});

const Patient = mongoose.model("Patient", PatientSchema);
module.exports = Patient;
