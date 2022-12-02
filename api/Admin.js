const express = require("express");
const router = express.Router();

const Admin = require("./../models/Admin");
router.post("/addAdmin", function (req, res, next) {
  // add quiz
  Admin.create(req.body)
    .then(
      (result) => {
        console.log("Admin Info has been Added ", result);
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(result);
      },
      (err) => next(err)
    )
    .catch((err) => next(err));
});

router.get("/allAdmins", function (req, res, next) {
  var query = Admin.find();
  query.count(function (err, count) {
    if (err) console.log(err);
    else res.json(count);
  });
});

router.get("/Admin", function (req, res, next) {
  // view attempted quiz
  Admin.find().exec(function (error, results) {
    if (error) {
      return next(error);
    }
    // Respond with valid data
    res.json(results);
  });
});

router.delete("/removeAdmin/:id", function (req, res) {
  // delete material
  Admin.deleteOne({ _id: req.params.id }, function (error, results) {
    if (error) {
      console.log(error);
    }
    // Respond with valid data
    res.json(results);
  });
});
router.put("/editappointment/:id/:date/:time", function (req, res) {
  // update marks
  Admin.findOneAndUpdate(
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
module.exports = router;
