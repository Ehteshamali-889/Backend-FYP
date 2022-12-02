require("dotenv").config();
// const { MongoClient, ServerApiVersion } = require("mongodb");
// const mongoose = require("mongoose");
// mongoose
//   .connect(process.env.MONGODB_URI, {
//     useNewUrlParser: true,
//     useUnifiedTopology: true,
//     serverApi: ServerApiVersion.v1,
//   })
//   .then(() => {
//     console.log("DB connected");
//   })
//   .catch((err) => {
//     console.log(err);
//   });

const { MongoClient, ServerApiVersion } = require("mongodb");
const mongoose = require("mongoose");
mongoose
  .connect(process.env.MONGODB_URI)
  .then(() => {
    console.log("DB connected");
  })
  .catch((err) => {
    console.log(err);
  });

// const { MongoClient, ServerApiVersion } = require("mongodb");
// const uri =
//   "mongodb+srv://admin:<password>@cluster0.77qxn.mongodb.net/UserDB?retryWrites=true&w=majority";
// const client = new MongoClient(uri, {
//   useNewUrlParser: true,
//   useUnifiedTopology: true,
//   serverApi: ServerApiVersion.v1,
// });
// client.connect((err) => {
//   const collection = client.db("UserDB").collection("tempuser");
//   console.log("Connected to DB");
//   // perform actions on the collection object
//   client.close();
// });
