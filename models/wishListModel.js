const mongoose = require("mongoose");

const wishListSchema = new mongoose.Schema({
  user: { type: mongoose.Types.ObjectId, ref: "User" }, //reference to the User model
  items: [
    {
      product: { type: mongoose.Schema.Types.ObjectId, ref: "Product" }, //reference to the Product model
    },
  ],
});

const Wishlist = mongoose.model("Wishlist", wishListSchema);
module.exports=Wishlist;