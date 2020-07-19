const mongoose = require("mongoose");
const orders = require("./orderHistory");
const userSchema = new mongoose.Schema({
  name: String,
  email: { type: String, unique: true },
  password: String,
  tel: { type: Number, default: 0 },
  isBlocked: { type: Boolean, default: false },
  cart: [{ id: Number, qty: Number }],
  orderHistory: { type: Array, default: [] }
});
const UsersModel = mongoose.model("users", userSchema);

module.exports = UsersModel;
