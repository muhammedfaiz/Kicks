const { ObjectId } = require("bson");
const mongoose = require("mongoose");

const userSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  email: {
    type: String,
    required: true,
  },
  password: {
    type: String,
    required: true,
  },
  mobile: {
    type: Number,
    unique: true,
    required: true,
  },
  isAdmin: {
    type: Boolean,
    default: false,
  },
  status: {
    type: Boolean,
    default: true,
  },
  wallet: {
    balance: { type: Number, default: 0 },
    details: [
      {
        type: { type: String, enum: ["credit", "debit", "refund"] },
        amount: { type: Number },
        date: { type: Date },
        transactionId: {
          type: Number,
          default: function () {
            return Math.floor(100000 + Math.random() * 900000);
          },
        },
      },
    ],
  },
  address: [
    {
      name: { type: String },
      house: { type: String },
      city: { type: String },
      state: { type: String },
      country: { type: String },
      pincode: { type: Number },
      type: { type: Number },
    },
  ],
});

const User = mongoose.model("User", userSchema);

module.exports = User;
