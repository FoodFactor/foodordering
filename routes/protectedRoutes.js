const express = require("../node_modules/express");
const router = express.Router();
const users = require("../models/users");
const jwt = require("../node_modules/jsonwebtoken");
const orderHistory = require("../models/orderHistory");

router.get("/verify", (req, res) => {
  res.send("verified");
});
router.post("/orders", (req, res) => {
  res.send("verified");
});
router.post("/addtocart", (req, res) => {
  users.findOne({ _id: req.user, "cart.id": req.body.id }).then(docs => {
    if (!docs) {
      users
        .updateOne(
          { _id: req.user },
          { $push: { cart: { id: req.body.id, qty: req.body.qty } } }
        )
        .then(docs => {
          res.send("added");
        })
        .catch(err => {
          res.sendStatus(500);
        });
    } else {
      res.send("already in your cart");
    }
  });
});
router.post("/deleteFromCart", (req, res) => {
  users
    .updateOne(
      { _id: req.user },
      { $pull: { cart: { id: req.body.id, qty: req.body.qty } } }
    )
    .then(docs => {
      if (docs) {
        res.send("deleted");
      }
    })
    .catch(err => {
      res.sendStatus(500);
    });
});
router.post("/feedForm", (req, res) => {
  const { rating, review } = req.body;
  console.log(req.user);

  users.findOne({ _id: req.user }).then(docs => {
    if (docs) {
      users
        .updateMany({ rating: rating }, { review: review })
        .then(docs => {
          res.send("feedback added");
        })
        .catch(err => {
          res.sendStatus(500);
        });
    }
  });
});

router.get("/rendercart", (req, res) => {
  users
    .findOne({ _id: req.user })
    .then(docs => {
      if (!docs) {
        res.send("user not found");
      } else {
        res.send(docs.cart);
      }
    })
    .catch(err => {
      res.send(err);
    });
});

router.get("/renderacc", (req, res) => {
  users
    .findOne({ _id: req.user })
    .then(docs => {
      if (!docs) {
        res.send("user not found");
      } else {
        res.send(docs.orderHistory);
      }
    })
    .catch(err => {
      res.send(err);
    });
});

router.get("/userinfo", (req, res) => {
  console.log(req.user);
  users
    .findOne({ _id: req.user })
    .then(docs => {
      if (!docs) {
        res.send("user not found");
      } else {
        res.send([docs.name, docs.email, docs.tel]);
      }
    })
    .catch(err => {
      res.send(err);
    });
});

router.post("/orderHistory", async (req, res) => {
  const user = await users.findOne({ _id: req.user });
  if (!user) {
    res.send("error");
  }
  try {
    user.orderHistory = [
      ...(user.orderHistory ? user.orderHistory : []),
      {
        products: req.body.product,
        date: new Date().toDateString() + " " + new Date().toTimeString(),
        totalPrice: req.body.price,
        rating: 5,
        review: "jab dalega aajegi"
      }
    ];
    user.cart = [];
    user.save();
    res.send("order placed");
  } catch (e) {
    res.send("error");
  }
});

module.exports = router;
