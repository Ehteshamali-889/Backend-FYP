const express = require("express");
const router = express.Router();

const Account = require("./../models/Account");
router.post("/addAccount", function (req, res, next) {
  // add quiz
  Account.create(req.body)
    .then(
      (result) => {
        console.log("Account Info has been Added ", result);
        res.statusCode = 200;
        res.setHeader("Content-Type", "application/json");
        res.json(result);
      },
      (err) => next(err)
    )
    .catch((err) => next(err));
});

router.get("/allAccounts", function (req, res, next) {
  var query = Account.find();
  query.count(function (err, count) {
    if (err) console.log(err);
    else res.json(count);
  });
});

router.get("/allAccountslist", function (req, res, next) {
  // view attempted quiz
  Account.find().exec(function (error, results) {
    if (error) {
      return next(error);
    }
    // Respond with valid data
    res.json(results);
  });
});

router.delete("/removeAccount/:id", function (req, res) {
  // delete material
  Account.deleteOne({ _id: req.params.id }, function (error, results) {
    if (error) {
      console.log(error);
    }
    // Respond with valid data
    res.json(results);
  });
});
router.put("/editappointment/:id/:date/:time", function (req, res) {
  // update marks
  Account.findOneAndUpdate(
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

router.patch("/editaccount/:id", function (req, res) {
    // update marks
    Account.findOneAndUpdate({ _id: req.params.id }, function (error, results) {
      if (error) {
        return next(error);
      }
      // Respond with valid data
      res.json(results);
    });
  });

  router.patch("/updateaccount/:id", async (req, res) => {
    try {
      const { id } = req.params;
  
      const updateduser = await Account.findByIdAndUpdate(id, req.body, {
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
