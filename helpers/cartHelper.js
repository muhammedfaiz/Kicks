const Cart = require("../models/cartModel");
const mongoose = require("mongoose");
const ObjectId = require("mongoose").Types.ObjectId;
// add cart helper

const addToCartHelper = (prodId, userId,size) => {
  return new Promise(async (resolve, reject) => {
    try {
      const result = await Cart.updateOne(
        { user: new mongoose.Types.ObjectId(userId) },
        { $push: { items: { product: new mongoose.Types.ObjectId(prodId),size:size } } },
        { upsert: true }
      );
      resolve(result);
    } catch (error) {
      console.log(error);
    }
  });
};

const cartCheck = (prodId, userId) => {
  return new Promise(async (resolve, reject) => {
    const result = await Cart.findOne({
      user: userId,
      "items.product": prodId,
    });
    if (result) {
      resolve(true);
    } else {
      resolve(false);
    }
  });
};

const getAllItems = (id) => {
  return new Promise(async (resolve, reject) => {
    const data = await Cart.findOne({ user: id }).populate("items.product"); 
    if (data) {
      let total=0;
      for(let i=0;i<data.items.length;i++){
        const offerPrice=data.items[i].product.price-(data.items[i].product.price * data.items[i].product.discount / 100);
        total += Math.round(data.items[i].quantity * offerPrice);
        const priceAdd = await Cart.updateOne({user:id,"items._id": data.items[i]._id },{$set:{"items.$.price":offerPrice}});
      }
      const totalAdd= await Cart.updateOne({user:id},{$set:{total:total}});
      const result = await Cart.findOne({ user: id }).populate("items.product");
      resolve(result);
    } else{
      resolve(false);
    }
  });
};

const updateQuantityHelper = (increaseQuantity, itemId, userId) => {
  return new Promise(async (resolve, reject) => {
    const update = await Cart.updateOne(
      {
        user: new ObjectId(userId),
        "items._id": new ObjectId(itemId),
      },
      {
        $inc: { "items.$.quantity": increaseQuantity },
      }
    );
    resolve(update);
  });
};

const deleteItemHelper = (itemId, userId) => {
  return new Promise(async (resolve, reject) => {
    const remove = await Cart.updateOne(
      {
        user: new ObjectId(userId),
      },
      {
        $pull: { items: { _id: itemId } },
      }
    );
    resolve(remove);
  });
};

const emptyCart=(id)=>{
  return new Promise(async(resolve ,reject )=>{
    const result = await Cart.deleteOne({user:id});
    resolve(result);
  });
}

module.exports = {
  addToCartHelper,
  cartCheck,
  getAllItems,
  updateQuantityHelper,
  deleteItemHelper,
  emptyCart
};
