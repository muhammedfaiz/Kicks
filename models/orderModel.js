const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  user: { type: mongoose.Types.ObjectId, ref: "User" },
  items: [
    {
      product: { type: mongoose.Types.ObjectId, ref: "Product" },
      quantity: { type: Number },
      size: { type: String },
      price: { type: Number },
      discount: { type: Number },
      status: {
        type: String,
        enum: [
          "Pending",
          "Shipped",
          "Delivered",
          "Canceled",
          "Return",
          "Returned",
        ],
        default: "Pending",
      },
    },
  ],
  address: {
    name: { type: String },
    house: { type: String },
    city: { type: String },
    state: { type: String },
    country: { type: String },
    pincode: { type: Number },
    mobile: { type: Number },
  },
  paymentMethod: { type: String },
  orderedOn: { type: Date, default: Date.now },
  orderId: {
    type: Number,
    default: function () {
      return Math.floor(100000 + Math.random() * 900000);
    },
  },
  deliveredOn: {
    type: Date,
  },

  total: { type: Number },
  coupon: { type: String },
  status: {
    type: String,
    enum: ["Pending", "Delivered","Payment Pending"],
    default: "Pending",
  },
});


const Order = mongoose.model("Order", orderSchema);
module.exports = Order;
