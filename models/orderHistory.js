const mongoose = require("mongoose");
const orders = new mongoose.Schema({
  // tel: { type: Number, default: 0 },
  orderHistory: [
    {
      products: [{ id: Number, qty: Number }],
      totalPrice: Number,
      rating: { type: Number, default: 0 },
      review: { type: String, default: "good" }
    }
  ]
});
// const OrdersModel = mongoose.model("orderHistory", orders);

module.exports = orders;
