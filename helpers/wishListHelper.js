const Wishlist = require("../models/wishListModel");
const ObjectId = require("mongoose").Types.ObjectId;

const wishListAddHelper = (prodId, userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const addWishList = await Wishlist.updateOne(
        { user: new ObjectId(userId) },
        {
          $push: { items: { product: new ObjectId(prodId) } },
        },
        { upsert: 1 }
      );
      resolve(addWishList);
    } catch (error) {
      console.log(error);
    }
  });
};

const checkWishList = (prodId, userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const result = await Wishlist.findOne({
        user: userId,
        "items.product": prodId,
      });
      if (result) {
        resolve(true);
      } else {
        resolve(false);
      }
    } catch (error) {
      console.log(error);
    }
  });
};

const removeProductHelper = (prodId, userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const result = await Wishlist.updateOne(
        { user: new ObjectId(userId) },
        { $pull: { items: { product: prodId } } }
      );
      resolve(result);
    } catch (error) {
      console.log(error);
    }
  });
};

const getAllItemsHelper = (userId)=>{
    return new Promise(async(resolve, reject) => { 
        try {
            const wishList = await Wishlist.findOne({user : userId}).populate('items.product');
            resolve(wishList);
        } catch (error) {
            console.log(error);
        }
     })
}

module.exports = {
  wishListAddHelper,
  checkWishList,
  removeProductHelper,
  getAllItemsHelper
};
