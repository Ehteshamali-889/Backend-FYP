const express = require("express");
const router = express.Router();
require("dotenv").config();
const Patient = require("./../models/Patient");
const bcrypt = require("bcrypt");

router.post("/addPatient", function (req, res, next) {
  // add quiz
  Patient.create(req.body)
    .then(
      (result) => {
        console.log("Patient Info has been Added ", result);
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(result);
      },
      (err) => next(err)
    )
    .catch((err) => next(err));
});

router.get("/allPatients", function (req, res, next) {
  var query = Patient.find();
  query.count(function (err, count) {
    if (err) console.log(err);
    else res.json(count);
  });
});

router.get("/Patient", function (req, res, next) {
  // view attempted quiz
  Patient.find().exec(function (error, results) {
    if (error) {
      return next(error);
    }
    // Respond with valid data
    res.json(results);
  });
});


router.get("/patientsdetails", function (req, res, next) {
  // view attempted quiz
  Patient.find().exec(function (error, results) {
    if (error) {
      return next(error);
    }
    // Respond with valid data
    res.json(results);
  });
});

router.get("/homepatients", function (req, res, next) {
  // view attempted quiz
  Patient.find().limit(4).exec(function (error, results) {
    if (error) {
      return next(error);
    }
    // Respond with valid data
    res.json(results);
  });
});

router.delete("/removePatient/:id", function (req, res) {
  // delete material
  Patient.deleteOne({ _id: req.params.id }, function (error, results) {
    if (error) {
      console.log(error);
    }
    // Respond with valid data
    res.json(results);
  });
});
router.put("/editappointment/:id/:date/:time", function (req, res) {
  // update marks
  Patient.findOneAndUpdate(
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
router.post("/signup", (req, res) => {
  let { name, email, password } = req.body;
  name = name.trim();
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
    Patient.find({ email })
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
              const newUser = new Patient({
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

router.get("/threepatient", function (req, res, next) {
  // view attempted quiz
  Patient.find().limit(3).exec(function (error, results) {
    if (error) {
      return next(error);
    }
    // Respond with valid data
    res.json(results);
  });
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
    Patient.find({ email })
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

router.get("/allpatient", function (req, res, next) {
  // view attempted quiz
  Patient.find().exec(function (error, results) {
    if (error) {
      return next(error);
    }
    // Respond with valid data
    res.json(results);
  });
});

router.get("/allpatient/:id?", function (req, res, next) {
  // single user
  Patient.find({ _id: req.params.id }).exec(function (error, results) {
    if (error) {
      return next(error);
    }
    // Respond with valid data
    res.json(results);
  });
});

router.delete("/removepatient/:id", function (req, res) {
  // delete patient
  Patient.deleteOne({ _id: req.params.id }, function (error, results) {
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

    const userindividual = await Patient.findById({ _id: id });
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
