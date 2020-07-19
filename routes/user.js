const express = require("../node_modules/express");
const router = express.Router();
const users = require("../models/users");
const jwt = require("../node_modules/jsonwebtoken");
var bcrypt = require("bcryptjs");
var salt = bcrypt.genSaltSync(10);

router.post("/registerForm", (req, res) => {
  users.find({ tel: req.body.tel }).then(docs => {
    if (docs.length !== 0) {
      res.send("found");
    } else {
      let user = new users();
      user.name = req.body.name;
      user.email = req.body.email;
      user.tel = req.body.tel;
      bcrypt.hash(req.body.password, 10, (err, hash) => {
        user.password = hash;
        user
          .save()
          .then(() => {
            res.json("Submitted");
          })
          .catch(err => {
            console.log(err);
          });
      });
    }
  });
});

router.post("/loginForm", (req, res) => {
  const { tel, password } = req.body;
  users
    .findOne({ tel })
    .then(user => {
      if (user) {
        bcrypt.compare(req.body.password, user.password, (err, isMatch) => {
          if (err) {
            res.sendStatus(500);
          } else if (isMatch) {
            jwt.sign({ _id: user._id }, process.env.secret, (err, token) => {
              if (err) {
                res.send(500);
              } else {
                res.send({ token: token });
              }
            });
          } else {
            res.send("Password Incorrect");
          }
        });
      } else {
        res.json(
          "Not Found ! Please Check Your Provided Mobile Number or Password"
        );
      }
    })
    .catch(err => {
      res.send(401);
    });
});
module.exports = router;
