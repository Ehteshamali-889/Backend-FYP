const express = require("express");
const router = express.Router();
const path = require("path");


const multer = require("multer");

// const fs = require("fs");
// const storage = multer.diskStorage({
//   destination: (req, file, cb) => {
//     cb(null, "uploads");
//   },
//   filename: (req, file, cb) => {
//     cb(null, file.originalname);
//   },
// });

// const upload = multer({ storage: storage });

// router.post("/uploadimg", upload.single("testImage"), (req, res) => {
//   const saveImage =  Payment({
//     picname: req.body.picname,
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


// router.get('/getimg',async (req,res)=>{
//   const allData = await Payment.find()
//   res.json(allData)
// })

// Storage Engin That Tells/Configures Multer for where (destination) and how (filename) to save/upload our files
const fileStorageEngine = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "./images"); //important this is a direct path fron our current file to storage location
  },
  filename: (req, file, cb) => {
    cb(null, Date.now() + "--" + file.originalname);
  },
});

// Route To Load Index.html page to browser
router.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "index.html"));
});

// The Multer Middleware that is passed to routes that will receive income requests with file data (multipart/formdata)
// You can create multiple middleware each with a different storage engine config so save different files in different locations on server
const upload = multer({ storage: fileStorageEngine });

// Single File Route Handler
router.post("/single", upload.single("image"), (req, res) => {
  console.log(req.file);
  res.send("Single FIle upload success");
  if(error){
    console.log(error);
  }
});

// Multiple Files Route Handler
router.post("/multiple", upload.array("images", 3), (req, res) => {
  console.log(req.files);
  res.send("Multiple Files Upload Success");
});

const Payment = require("./../models/Payment");
router.post("/addPayment", function (req, res, next) {
  // add quiz
  Payment.create(req.body)
    .then(
      (result) => {
        console.log("Payment Info has been Added ", result);
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(result);
      },
      (err) => next(err)
    )
    .catch((err) => next(err));
});

router.get("/allPayments", function (req, res, next) {
  // var query = Payment.find({},{"amount":1,"id":0});
  var query = Payment.aggregate([
    {
      $group: {
        _id: null,
        // max: { $max: "$amount" },
        // min: { $min: "$amount" },
        amount: { $sum: "$amount" },
      },
      
    },
    
  ]);
//   console.log(query);
  query.exec(function(err,result){
    // console.log(result[0].amount);
    const value = result[0].amount;
    res.json(value);
  })
});

router.get("/Payment", function (req, res, next) {
  // view attempted quiz
  Payment.find().exec(function (error, results) {
    if (error) {
      return next(error);
    }
    // Respond with valid data
    res.json(results);
  });
});

router.get("/Payment/:id", function (req, res, next) {
  // view attempted quiz
  Payment.find({ paidby: req.params.id }).exec(function (error, results) {
    if (error) {
      return next(error);
    }
    // Respond with valid data
    console.log("First",results)
    // res.json(results);
  });
});

router.delete("/removePayment/:id", function (req, res) {
  // delete material
  Payment.deleteOne({ _id: req.params.id }, function (error, results) {
    if (error) {
      console.log(error);
    }
    // Respond with valid data
    res.json(results);
  });
});
router.put("/editPayment/:id/:date/:time", function (req, res) {
  // update marks
  Payment.findOneAndUpdate(
    { _id: req.params.id },
    { name: req.params.date },
    { email: req.params.time },
    function (error, results) {
      if (error) {
        return next(error);
      }
      // Respond with valid data
      res.json(results);
    }
  );
});

router.get("/allpayment", function (req, res, next) {

  Payment.find().exec(function (error, results) {
    if (error) {
      return next(error);
    }
    // Respond with valid data
    res.json(results);
  });
});

router.get("/allpayment/:id?", function (req, res, next) {
  // single user
  Payment.find({ _id: req.params.id }).exec(function (error, results) {
    if (error) {
      return next(error);
    }
    // Respond with valid data
    res.json(results);
  });
});

router.delete("/removepayment/:id", function (req, res) {
  // delete patient
  Payment.deleteOne({ _id: req.params.id }, function (error, results) {
    if (error) {
      console.log(error);
    }
    // Respond with valid data
    res.json(results);
  });
});


router.get("/getuser/:id", async (req, res) => {
  try {
    console.log(req.params);
    const { id } = req.params;

    const userindividual = await Payment.findById({ _id: id });
    console.log(userindividual);
    res.status(201).json(userindividual);
    console.log(userindividual.email);
    
  } catch (error) {
    res.status(422).json(error);
  }
  
});

router.patch("/updateuser/:id", async (req, res) => {
  try {
    const { id } = req.params;

    const updateduser = await Patient.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    console.log(updateduser);
    res.status(201).json(updateduser);
    console.log(updateduser.experience)
  } catch (error) {
    res.status(422).json(error);
  }
});



module.exports = router;
