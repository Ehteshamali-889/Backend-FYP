// const express=require("express")
// const app=express()
// const port=3000;
// app.get('/',(req,res)=>{
//     res.send("Hello");
// })

// app.listen(port,()=>{
//     console.log(`Server started ${port}`)
// })
require("./config/db");
const app = require("express")();
var cors = require("cors");

// const multer = require("multer");

// const fs = require("fs");
// const imageModel = require("./models");


// multer setting

// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "uploads");
//   },
//   filename: (req, file, cb) => {
//     cb(null, file.originalname);
//   },
// });

// const upload = multer({ storage: storage });

// app.post("/", upload.single("testImage"), (req, res) => {
//   const saveImage =  imageModel({
//     name: req.body.name,
//     img: {
//       data: fs.readFileSync("uploads/" + req.file.filename),
//       contentType: "image/png",
//     },
//   });
//   saveImage
//     .save()
//     .then((res) => {
//       console.log("image is saved");
//     })
//     .catch((err) => {
//       console.log(err, "error has occur");
//     });
//     res.send('image is saved')
// });


// app.get('/getmyimage',async (req,res)=>{
//   const allData = await imageModel.find()
//   res.json(allData)
// })


const port = process.env.PORT || 3010;
const UserRouter = require("./api/User");
const DoctorRouter = require("./api/Doctor");
const PatientRouter = require("./api/Patient");
const AdminRouter = require("./api/Admin");
const AppointmentRouter = require("./api/Appointment");
const PaymentRouter = require("./api/Payment");
const ImageRouter = require("./api/Image");
const EducationRouter=require('./api/Education')
const ReviewRouter=require('./api/Review')
const AccountRouter=require('./api/Account')
const bodyParser = require("express").json;
app.use(bodyParser());
app.use(cors());
app.use("/user", UserRouter);
app.use("/doctor", DoctorRouter);
app.use("/patient", PatientRouter);
app.use("/admin", AdminRouter);
app.use("/appointment", AppointmentRouter);
app.use("/payment", PaymentRouter);
app.use("/image", ImageRouter);
app.use("/education", EducationRouter);
app.use("/review", ReviewRouter);
app.use("/account", AccountRouter);
app.listen(port, () => {
  console.log(`Server started ${port}`);
});
