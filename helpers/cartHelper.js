const Cart = require("../models/cartModel");
const mongoose = require("mongoose");
const Product = require("../models/productModel");
const ObjectId = require("mongoose").Types.ObjectId;
// add cart helper

const addToCartHelper = (prodId, userId, size) => {
  return new Promise(async (resolve, reject) => {
    try {
      const result = await Cart.updateOne(
        { user: new mongoose.Types.ObjectId(userId) },
        {
          $push: {
            items: { product: new mongoose.Types.ObjectId(prodId), size: size },
          },
        },
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
      let total = 0;
      for (let i = 0; i < data.items.length; i++) {
        const offerPrice =
          data.items[i].product.price -
          (data.items[i].product.price * data.items[i].product.discount) / 100;
        total += Math.round(data.items[i].quantity * offerPrice);
        const priceAdd = await Cart.updateOne(
          { user: id, "items._id": data.items[i]._id },
          { $set: { "items.$.price": offerPrice } }
        );
      }
      const totalAdd = await Cart.updateOne(
        { user: id },
        { $set: { total: total } }
      );
      const result = await Cart.findOne({ user: id }).populate("items.product");
      resolve(result);
    } else {
      resolve(false);
    }
  });
};

const updateQuantityHelper = (increaseQuantity, itemId, userId) => {
  return new Promise(async (resolve, reject) => {
    const cart = await Cart.aggregate([
      { $unwind: "$items" },
      {
        $match: {
          user: new ObjectId(userId),
          "items._id": new ObjectId(itemId),
        },
      },
    ]);
    const product = await Product.aggregate([
      { $unwind: "$stock" },
      {
        $match: {
          _id: cart[0].items.product,
          "stock.size": cart[0].items.size,
        },
      },
    ]);
    if (
      product[0].stock.quantity >= cart[0].items.quantity + increaseQuantity &&
      cart[0].items.quantity + increaseQuantity > 0
    ) {
      const update = await Cart.updateOne(
        {
          user: new ObjectId(userId),
          "items._id": new ObjectId(itemId),
        },
        {
          $inc: { "items.$.quantity": increaseQuantity },
        }
      );
      const data = await Cart.findOne({ user: userId }).populate(
        "items.product"
      );
      let total = 0;
      for (let i = 0; i < data.items.length; i++) {
        const offerPrice =
          data.items[i].product.price -
          (data.items[i].product.price * data.items[i].product.discount) / 100;
        total += Math.round(data.items[i].quantity * offerPrice);
        const priceAdd = await Cart.updateOne(
          { user: userId, "items._id": data.items[i]._id },
          { $set: { "items.$.price": offerPrice } }
        );
      }
      const totalAdd = await Cart.updateOne(
        { user: userId },
        { $set: { total: total } }
      );
      resolve(update);
    } else if (cart[0].items.quantity + increaseQuantity === 0) {
      resolve("Quantity cannot be 0");
    } else {
      resolve("Out of stock");
    }
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

const emptyCart = (id) => {
  return new Promise(async (resolve, reject) => {
    const result = await Cart.deleteOne({ user: id });
    resolve(result);
  });
};

const getCartItem = (itemId, userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const item = await Cart.aggregate([
        { $unwind: "$items" },
        {
          $match: {
            user: new ObjectId(userId),
            "items._id": new ObjectId(itemId),
          },
        },
        {
          $lookup: {
            from: "products",
            as: "items.product",
            localField: "items.product",
            foreignField: "_id",
          },
        },
      ]);
      resolve(item[0]);
    } catch (error) {
      console.log(error);
    }
  });
};

const checkoutgetCart = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const cart = await Cart.findOne({ user: userId }).populate(
        "items.product"
      );
      resolve(cart);
    } catch (error) {
      console.log(error);
    }
  });
};

module.exports = {
  addToCartHelper,
  cartCheck,
  getAllItems,
  updateQuantityHelper,
  deleteItemHelper,
  emptyCart,
  getCartItem,
  checkoutgetCart,
};
