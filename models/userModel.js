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
    type: Array,
    default: [
      {
        balance: 0,
        paymentMethod: null,
        transaction_id: null,
        date: null,
        withdrawal: null,
        deposit: null,
      },
    ],
  },
  DOB: {
    type: Date,
  },
  address: {
    type: Array,
    default: [
      {
        name: null,
        house: null,
        city: null,
        state: null,
        country: null,
        mobile: null,
        address_id: null,
      },
    ],
  },
});

const User = mongoose.model("User", userSchema);

module.exports = User;
