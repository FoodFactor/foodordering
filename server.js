const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
var users = require("./models/users");
var userRoutes = require("./routes/user");
var protectedRoutes = require("./routes/protectedRoutes");
var jwt = require("jsonwebtoken");
var path = require("path");
require("dotenv").config();
const app = express();
app.use(express.static(path.join(__dirname, "build")));
const port = process.env.PORT || 5000;
JwtValidator = (req, res, next) => {
  const header = req.headers.authorization;
  const bearer = header.split(" ");
  const token = bearer[1];
  jwt.verify(token, process.env.secret, (err, data) => {
    if (err) {
      res.send(err);
    }
    users
      .findOne({ _id: data._id })
      .then((docs) => {
        if (docs) {
          req.user = data._id;
          next();
        } else {
          res.send("!user");
        }
      })
      .catch((err) => {
        res.send(err);
      });
  });
};

app.use(cors());
app.use(express.json());
app.use("/", userRoutes);
app.use("/protected", JwtValidator, protectedRoutes);

const uri = process.env.ATLAS_URI;
mongoose.connect(uri, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
});
//mongoose.Promise = global.Promise;
const connection = mongoose.connection;
connection.once("open", () => {
  console.log("MongoDB database connection established successfully");
});
connection.on("error", (err) => {
  console.log("Error occurred");
});
app.get("*", (req, res) => {
  res.sendFile(path.join(__dirname, "build", "index.html"));
});

app.listen(port, () => {
  console.log(`Server is running on port: ${port}`);
});
