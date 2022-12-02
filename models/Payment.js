const mongoose = require("mongoose");
const Schema = mongoose.Schema;
const PaymentSchema = new Schema({
  paidby:String,
  paidto:String,
  name:String,
  phonenumber:String,
  type: String,
  amount: Number
});

const Payment = mongoose.model("Payment", PaymentSchema);
module.exports = Payment;
