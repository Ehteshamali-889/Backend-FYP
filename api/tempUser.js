const express = require("express");
const router = express.Router();

const User = require("./../models/User");

const bcrypt = require("bcrypt");
const UserVerification = require("../models/UserVerification");

const development = "http://localhost:5000/";
const production = "https://practice-native-app.herokuapp.com/";
const currentUrl = process.env.NODE_ENV ? production : development;

// nodemailer stuff
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: process.env.AUTH_EMAIL,
    pass: process.env.AUTH_PASS,
  },
});

// testing success
transporter.verify((error, success) => {
  if (error) {
    console.log(error);
  } else {
    console.log("Ready for messages");
    console.log(success);
  }
});

router.post("/signup", (req, res) => {
  let { name, email, password, dateOfBirth } = req.body;
  name = name.trim();
  email = email.trim();
  password = password.trim();
  dateOfBirth = dateOfBirth.trim();
  if (name == "" || email == "" || password == "" || dateOfBirth == "") {
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
  } else if (!new Date(dateOfBirth).getTime()) {
    res.json({
      status: "FAILED",
      message: "Invalid date of Birth entered",
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
                dateOfBirth,
              });
              newUser
                .save()
                .then((result) => {
                  // res.json({
                  //   status: "SUCCESS",
                  //   message: "SignUp Success",
                  //   data: result,
                  // });
                  sendVerificationEmail(result, res);
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

// verify email
router.get("/verify/:userId/:uniqueString", (req, res) => {
  let { userId, uniqueString } = req.params;
  UserVerification.find({ userId })
    .then((result) => {
      if (result.length > 0) {
        const { expiresAt } = result[0];
        const hashedUniqueString = result[0].uniqueString;
        if (expiresAt < Date.now()) {
          UserVerification,
            deelteOne({ userId }).then((result) => {
              User.deleteOne({ _id: userId })
                .then(() => {
                  let message = "Link has expired.Please sign up again";
                  res.redirect(`/user/verified?error=true&message=${message}`);
                })
                .catch((error) => {
                  console.log(error);
                  let message =
                    "Clearing user with expired unique string failed";
                  res.redirect(`/user/verified?error=true&message=${message}`);
                });
            });
        }
      } else {
        let message =
          "Account record does not exist or has been verified already.Please sign up or login";
        res.redirect(`/user/verified?error=true&message=${message}`);
      }
    })
    .catch((error) => {
      console.log(error);
      let message =
        "An error occured while checking for existing user vrification record";
      res.redirect(`/user/verified?error=true&message=${message}`);
    });
});

// verified page route
router.get("/verfied", (_, res) => {
  res.sendFile(path.join(__dirame, `./../views/verified.html`));
});

const sendVerificationEmail = ({ _id, email }, res) => {
  // const currentUrl='http://localhost:5000/';
  const uniqueString = uuidv4() + _id;
  const mailOptions = {
    from: process.env.AUTH_EMAIL,
    to: email,
    subject: "Verify Your Email",
    html: `<p>Verify your email address to omplete the signup and login into your account</p><p>This link
    <b>expires in 6 hours</b>.</p><p>Press<a href =${
      currentUrl + "user/verify/" + _id + "/" + uniqueString
    }>here</a>to proceed.</p>`,
  };
  const saltRounds = 10;
  bcrypt.hash(uniqueString, saltRounds).then((hashedUniqueString) => {
    const newVerifictaion = new UserVerification({
      userId: _id,
      uniqueString: hashedUniqueString,
      createdAt: Date.now(),
      expiresAt: Date.now() + 21600000,
    });
    newVerifictaion
      .save()
      .then(() => {
        transporter
          .sendMail(mailOptions)
          .then(() => {
            res.json({
              status: "PENDING",
              message: "Verification email sent",
              data: {
                userId: _id,
                email,
              },
            });
          })
          .catch((err) => {
            res.json({
              status: "FAILED",
              message: "Verification email failed",
            });
            console.log(err);
          });
      })
      .catch(error);
  });
};

module.exports = router;
