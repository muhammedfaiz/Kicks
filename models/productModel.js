const mongoose = require("mongoose");

const productSchema = mongoose.Schema({
  name: {
    type: String,
    required: true,
  },
  brandName: {
    type: String,
    required: true,
  },
  description: {
    type: String,
    required: true,
  },
  price: {
    type: Number,
    required: true,
  },
  discount: {
    type: Number,
    required: true,
  },
   stock:[
    {
        size:{type:String,enum:["S","M","L"]},
        quantity:{type:Number,default:0}
    },
   ],
  status: {
    type: Boolean,
    default: true,
  },
  images: {
    type: Array,
    required: true,
  },
  category: {
    type: mongoose.Types.ObjectId, //referencing the Category model
    ref: "Category", //the field in Category model that this field is referencing to
  },
  
},{
  timestamps:true
});

const Product = mongoose.model("Product", productSchema);
module.exports = Product;
