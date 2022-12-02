const express = require("express");
const router = express.Router();

const Appointment = require("./../models/Appointment");
router.post("/addAppointment", function (req, res, next) {
  // add quiz
  Appointment.create(req.body)
    .then(
      (result) => {
        console.log("Appointment Info has been Added ", result);
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(result);
      },
      (err) => next(err)
    )
    .catch((err) => next(err));
});

router.get("/allAppointments", function (req, res, next) {
  var query = Appointment.find();
  query.count(function (err, count) {
    if (err) console.log(err);
    else res.json(count);
  });
});

router.get("/futureappointments", function (req, res, next) {
  Appointment.find({ completed: "no" }).exec(function (error, results) {
    if (error) {
      return next(error);
    }

    res.json(results);
  });
});

router.get("/singleappointments", function (req, res, next) {
  Appointment.find({ completed: "no" }).limit(1).exec(function (error, results) {
    if (error) {
      return next(error);
    }

    res.json(results);
  });
});

router.get("/futureappointments/:id", function (req, res, next) {
  Appointment.find({ doctorid: req.params.id,completed: "no" }).exec(function (error, results) {
    if (error) {
      return next(error);
    }

    res.json(results);
  });
});

router.get("/futurepatientappointments/:id", function (req, res, next) {
  
  Appointment.find({patient: req.params.id,completed: "no"}).exec(function (error, results) {
    if (error) {
      return next(error);
    }

    res.json(results);
  });
  // Appointment.find({$or:[{region: "NA"},{sector:"Some Sector"}]}).exec(function (error, results) {
  //   if (error) {
  //     return next(error);
  //   }

  //   res.json(results);
  // });
});

router.get("/futuredoctorappointments/:id", function (req, res, next) {
  
  Appointment.find({doctorid: req.params.id,completed: "no"}).exec(function (error, results) {
    if (error) {
      return next(error);
    }

    res.json(results);
  });
  
});

router.get("/unpaidappointments/:id", function (req, res, next) {
  
  Appointment.find({patient: req.params.id,paid: "no"}).exec(function (error, results) {
    if (error) {
      return next(error);
    }

    res.json(results);
  });
  
});

router.get("/pastappointments", function (req, res, next) {

  Appointment.find({ completed: "yes" }).exec(function (error, results) {
    if (error) {
      return next(error);
    }

    res.json(results);
  });
});

router.get("/pastappointments/:id", function (req, res, next) {
  Appointment.find({ doctorid: req.params.id,completed: "yes" }).exec(function (error, results) {
    if (error) {
      return next(error);
    }

    res.json(results);
  });
});

router.get("/pastpatientappointments/:id", function (req, res, next) {
  Appointment.find({ patient: req.params.id,completed: "yes" }).exec(function (error, results) {
    if (error) {
      return next(error);
    }

    res.json(results);
  });
});

router.get("/Appointment", function (req, res, next) {
  // view attempted quiz
  Appointment.find().exec(function (error, results) {
    if (error) {
      return next(error);
    }
    // Respond with valid data
    res.json(results);
  });
});

router.delete("/removeAppointment/:id", function (req, res) {
  // delete material
  Appointment.deleteOne({ _id: req.params.id }, function (error, results) {
    if (error) {
      console.log(error);
    }
    // Respond with valid data
    res.json(results);
  });
});
router.put("/editappointment/:id/:date/:time", function (req, res) {
  // update marks
  Appointment.findOneAndUpdate(
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

router.get("/allappointment", function (req, res, next) {
  // view attempted quiz
  Appointment.find().exec(function (error, results) {
    if (error) {
      return next(error);
    }
    // Respond with valid data
    res.json(results);
  });
});

router.get("/allappointment/:id?", function (req, res, next) {
  // single user
  Appointment.find({ _id: req.params.id }).exec(function (error, results) {
    if (error) {
      return next(error);
    }
    // Respond with valid data
    res.json(results);
  });
});

router.delete("/removeappointment/:id", function (req, res) {
  // delete patient
  Appointment.deleteOne({ _id: req.params.id }, function (error, results) {
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

    const userindividual = await Appointment.findById({ _id: id });
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

    const updateduser = await Appointment.findByIdAndUpdate(id, req.body, {
      new: false,
    });

    console.log(updateduser);
    res.status(201).json(updateduser);
    console.log(updateduser.experience)
  } catch (error) {
    res.status(422).json(error);
  }
});


module.exports = router;
