const express = require("express");
const router = express.Router();
require("dotenv").config();
const bcrypt = require("bcrypt");
const Doctor = require("./../models/Doctor");
router.post("/addDoctor", function (req, res, next) {
  // add quiz
  Doctor.create(req.body)
    .then(
      (result) => {
        console.log("Doctor Info has been Added ", result);
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(result);
      },
      (err) => next(err)
    )
    .catch((err) => next(err));
});

router.get("/alldoctors", function (req, res, next) {
  var query = Doctor.find();
  query.count(function (err, count) {
    if (err) console.log(err);
    else res.json(count);
  });
});

router.get("/getuser/:id", async (req, res) => {
  try {
    console.log(req.params);
    const { id } = req.params;

    const userindividual = await Doctor.findById({ _id: id });
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

    const updateduser = await Doctor.findByIdAndUpdate(id, req.body, {
      new: true,
    });

    console.log(updateduser);
    res.status(201).json(updateduser);
    console.log(updateduser.experience)
  } catch (error) {
    res.status(422).json(error);
  }
});




router.get("/alldoctor", function (req, res, next) {
  // view attempted quiz
  Doctor.find().exec(function (error, results) {
    if (error) {
      return next(error);
    }
    // Respond with valid data
    res.json(results);
  });
});

// get doctor related to speciality

router.get("/specdoctor/:id", function (req, res, next) {
  // view attempted quiz
  Doctor.find({speciality:req.params.id}).exec(function (error, results) {
    if (error) {
      return next(error);
    }
    // Respond with valid data
    res.json(results);
  });
});

router.get("/homedoctor", function (req, res, next) {
  // view attempted quiz
  Doctor.find().limit(4).exec(function (error, results) {
    if (error) {
      return next(error);
    }
    // Respond with valid data
    res.json(results);
  });
});

router.get("/threedoctor", function (req, res, next) {
  // view attempted quiz
  Doctor.find().limit(3).exec(function (error, results) {
    if (error) {
      return next(error);
    }
    // Respond with valid data
    res.json(results);
  });
});

router.get("/alldoctor/:id?", function (req, res, next) {
  // view attempted quiz
  Doctor.find({ _id: req.params.id }).exec(function (error, results) {
    if (error) {
      return next(error);
    }
    // Respond with valid data
    res.json(results);
  });
});

router.delete("/removedoctor/:id", function (req, res) {
  // delete material
  Doctor.deleteOne({ _id: req.params.id }, function (error, results) {
    if (error) {
      console.log(error);
    }
    // Respond with valid data
    res.json(results);
  });
});
router.put("/editdoctor/:id", function (req, res) {
  // update marks
  Doctor.findOneAndUpdate({ _id: req.params.id }, function (error, results) {
    if (error) {
      return next(error);
    }
    // Respond with valid data
    res.json(results);
  });
});

router.put("/editappointment/:id/:date/:time", function (req, res) {
  // update marks
  Doctor.findOneAndUpdate(
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



router.get("/customsearch", (req, res) => {
  const { q } = req.query;
  Doctor.find().exec(function (error, results) {
    // Respond with valid data
    var newdata=res.json(results);
    console.log("All Doctor",newdata);
  });

  const keys = ["name"];

  const search = (data) => {
    return data.filter((item) =>
      keys.some((key) => item[key].toLowerCase().includes(q))
    );
  };

  q ? res.json(search(newdata).slice(0, 10)) : res.json(newdata.slice(0, 10));
});


router.get("/search", async (req, res) => {
	try {
		const search = req.body.search || "";

		const doctors = await Doctor.find({ name: { $regex: search, $options: "i" } })

		const response = {
			doctors,
		};

		res.status(200).json(response);
	} catch (err) {
		console.log(err);
		res.status(500).json({ error: true, message: "Internal Server Error" });
	}
});

router.get("/pagination", async (req, res) => {
	try {
		const page = parseInt(req.query.page) - 1 || 0;
		const limit = parseInt(req.query.limit) || 5;
		const search = req.query.search || "";
		// let sort = req.query.sort || "rating";
		// let genre = req.query.genre || "All";

		// const genreOptions = [
		// 	"Action",
		// 	"Romance",
		// 	"Fantasy",
		// 	"Drama",
		// 	"Crime",
		// 	"Adventure",
		// 	"Thriller",
		// 	"Sci-fi",
		// 	"Music",
		// 	"Family",
		// ];

		// genre === "All"
		// 	? (genre = [...genreOptions])
		// 	: (genre = req.query.genre.split(","));
		// req.query.sort ? (sort = req.query.sort.split(",")) : (sort = [sort]);

		// let sortBy = {};
		// if (sort[1]) {
		// 	sortBy[sort[0]] = sort[1];
		// } else {
		// 	sortBy[sort[0]] = "asc";
		// }

		const doctors = await Doctor.find({ name: { $regex: search, $options: "i" } })
			.skip(page * limit)
			.limit(limit);

		const total = await Doctor.countDocuments({
			name: { $regex: search, $options: "i" },
		});

		const response = {
			error: false,
			total,
			page: page + 1,
			limit,
			doctors,
		};

		res.status(200).json(response);
	} catch (err) {
		console.log(err);
		res.status(500).json({ error: true, message: "Internal Server Error" });
	}
});

router.get("/alldoctor", function (req, res, next) {
  // view attempted quiz
  Doctor.find().exec(function (error, results) {
    if (error) {
      return next(error);
    }
    // Respond with valid data
    res.json(results);
  });
});

router.get("/alldoctor/:id?", function (req, res, next) {
  // single user
  Doctor.find({ _id: req.params.id }).exec(function (error, results) {
    if (error) {
      return next(error);
    }
    // Respond with valid data
    res.json(results);
  });
});


router.post("/signup", (req, res) => {
  let { fullName,experience,speciality,price, email, password } = req.body;
  name = fullName.trim();
  email = email.trim();
  password = password.trim();
  experience=experience.trim()
  speciality=speciality.trim()
  price=price.trim()
  if (name == "" || email == "" || password == "" || experience == "" || speciality=="" || price=="" ) {
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
    Doctor.find({ email })
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
              const newUser = new Doctor({
                name,
                email,
                password: hashedPassword,
                experience:experience,
                speciality:speciality,
                price:price
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
    Doctor.find({ email })
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
