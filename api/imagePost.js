const express = require("express");
const router = express.Router();

const User = require("./../models/User");

require("dotenv").config();

const bcrypt = require("bcrypt");
const multer = require("multer");

const fs = require("fs");
const storage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "uploads");
  },
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  },
});

const upload = multer({ storage: storage });

router.post("/uploadimg", upload.single("testImage"), (req, res) => {
  const saveImage =  User({
    picname: req.body.picname,
    img: {
      data: fs.readFileSync("uploads/" + req.file.filename),
      contentType: "image/png",
    },
  });
  saveImage
    .save()
    .then((res) => {
      console.log("image is saved");
    })
    .catch((err) => {
      console.log(err, "error has occur");
    });
    res.send('image is saved')
});


router.get('/getimg',async (req,res)=>{
  const allData = await User.find()
  res.json(allData)
})


router.post("/mysignup",async (req, res) => {
  const { name,email, password } = req.body;

  try {
    const user = await User.create({ name,email, password });
    res.status(201).json(user);
  }
  catch(err) {
    const errors = handleErrors(err);
    res.status(400).json({ errors });
  }
});

router.post("/mysignin",async (req, res) => {
  const { email, password } = req.body;

  console.log(email, password);
  res.send('user login');
});

router.post("/signup", (req, res) => {
  let { fullName, email, password } = req.body;
  name = fullName.trim();
  email = email.trim();
  password = password.trim();
  if (name == "" || email == "" || password == "") {
    res.json({
      status: "FAILED",
      message: "Empty Input fields",
    });
  } else if (!/^[a-zA-Z ]*$/.test(name)) {
    res.json({
      status: "FAILED",
      message: "Invalid name entered",
    });
  } else if (!/^[\w-\.]+@([\w-]+\.)+[\w-]{2,4}$/.test(email)) {
    res.json({
      status: "FAILED",
      message: "Invalid email entered",
    });
  } else if (password.length < 8) {
    res.json({
      status: "FAILED",
      message: "Password is too short",
    });
  } else {
    User.find({ email })
      .then((result) => {
        if (result.length) {
          res.json({
            status: "FAILED",
            message: "User with provided email already exists",
          });
        } else {
          const saltRounds = 10;
          bcrypt
            .hash(password, saltRounds)
            .then((hashedPassword) => {
              const newUser = new User({
                name,
                email,
                password: hashedPassword,
              });
              newUser
                .save()
                .then((result) => {
                  res.json({
                    status: "SUCCESS",
                    message: "SignUp Success",
                    data: result,
                  });
                })
                .catch((err) => {
                  res.json({
                    status: "FAILED",
                    message: "An error occured while saving user account",
                  });
                });
            })
            .catch((err) => {
              res.json({
                status: "FAILED",
                message: "An error occured while hashing password",
              });
            });
        }
      })
      .catch((err) => {
        console.log(err);
        res.json({
          status: "FAILED",
          message: "An error occured while checking for existing user",
        });
      });
  }
});
router.post("/signin", (req, res) => {
  let { email, password } = req.body;
  email = email.trim();
  password = password.trim();

  if (email == "" || password == "") {
    res.json({
      status: "FAILED",
      message: "Empty Input fields",
    });
  } else {
    User.find({ email })
      .then((data) => {
        if (data) {
          const hashedPassword = data[0].password;
          bcrypt
            .compare(password, hashedPassword)
            .then((result) => {
              if (result) {
                res.json({
                  status: "SUCCESS",
                  message: "Signin success",
                  data: data,
                });
              } else {
                res.json({
                  status: "FAILED",
                  message: "Invalid password",
                });
              }
            })
            .catch((err) => {
              res.json({
                status: "FAILED",
                message: "Error occured while comparing password",
              });
            });
        } else {
          res.json({
            status: "FAILED",
            message: "Invalid Credentials",
          });
        }
      })
      .catch((err) => {
        res.json({
          status: "FAILED",
          message: "Error occured while checking for existing user",
        });
      });
  }
});



module.exports = router;
