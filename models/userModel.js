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
  address: [{
    name:{type:String},
    house:{type:String},
    city:{type:String},
    state:{type:String},
    country:{type:String},
    pincode:{type:Number},
    type:{type:Number}
  }],
});

const User = mongoose.model("User", userSchema);

module.exports = User;
