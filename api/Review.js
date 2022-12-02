const express = require("express");
const router = express.Router();

const Review = require("./../models/Review");
router.post("/addReview", function (req, res, next) {
  // add quiz
  Review.create(req.body)
    .then(
      (result) => {
        console.log("Review Info has been Added ", result);
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(result);
      },
      (err) => next(err)
    )
    .catch((err) => next(err));
});

router.get("/allReviews", function (req, res, next) {
  var query = Review.find();
  query.count(function (err, count) {
    if (err) console.log(err);
    else res.json(count);
  });
});

router.get("/Review", function (req, res, next) {
  // view attempted quiz
  Review.find().exec(function (error, results) {
    if (error) {
      return next(error);
    }
    // Respond with valid data
    res.json(results);
  });
});

router.delete("/removeReview/:id", function (req, res) {
  // delete material
  Review.deleteOne({ _id: req.params.id }, function (error, results) {
    if (error) {
      console.log(error);
    }
    // Respond with valid data
    res.json(results);
  });
});
router.put("/editappointment/:id/:date/:time", function (req, res) {
  // update marks
  Review.findOneAndUpdate(
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
