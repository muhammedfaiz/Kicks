const Order = require("../models/orderModel");
const Cart = require("../models/cartModel");
const User = require("../models/userModel");
const Product = require("../models/productModel");
const Coupon = require("../models/couponModel");
const ObjectId = require("mongoose").Types.ObjectId;

const placeOrderHelper = (data, userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const cart = await Cart.findOne({ user: userId });
      const userAddress = await User.findOne(
        { _id: userId, "address._id": data.address },
        { "address.$": 1, _id: 0 }
      );
      const user = await User.findOne({ _id: userId });
      let items = [];
      for (let i = 0; i < cart.items.length; i++) {
        items.push({
          product: cart.items[i].product,
          quantity: cart.items[i].quantity,
          size: cart.items[i].size,
          price: cart.items[i].price,
        });
        let product = await Product.updateOne(
          { _id: cart.items[i].product, "stock.size": cart.items[i].size },
          { $inc: { "stock.$.quantity": -cart.items[i].quantity } }
        );
      }
      if (cart.coupon) {
        const coupon = await Coupon.findOne({ code: cart.coupon });
        coupon.usedBy.push(userId);
        await coupon.save();
      }
      if (cart && userAddress) {
        const order = await Order.create({
          user: new ObjectId(userId),
          items: items,
          address: {
            name: userAddress.address[0].name,
            house: userAddress.address[0].house,
            city: userAddress.address[0].city,
            state: userAddress.address[0].state,
            country: userAddress.address[0].country,
            pincode: userAddress.address[0].pincode,
            mobile: user.mobile,
          },
          paymentMethod: data.payment,
          total: cart.total,
        });
        resolve(order);
      }
    } catch (error) {
      console.log(error);
    }
  });
};

const orderUserHelper = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const data = await Order.find({ user: userId }).populate("items.product");
      if (data) {
        resolve(data);
      }
    } catch (error) {
      console.log(error);
    }
  });
};

const orderDetailsHelper = (orderId) => {
  return new Promise(async (resolve, reject) => {
    const order = await Order.findOne({ _id: orderId })
      .populate("items.product")
      .populate("user");
    resolve(order);
  });
};

const orderDetailsUserHelper = (orderId, userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const order = await Order.findOne({ _id: orderId }).populate(
        "items.product"
      );
      resolve(order);
    } catch (error) {
      console.log(error);
    }
  });
};

const orderCancelHelper = (orderId, itemId) => {
  return new Promise(async (resolve, reject) => {
    const order = await Order.aggregate([
      { $unwind: "$items" },
      {
        $match: {
          _id: new ObjectId(orderId),
          "items._id": new ObjectId(itemId),
        },
      },
    ]);

    const product = await Product.updateOne(
      { _id: order[0].items.product, "stock.size": order[0].items.size },
      {
        $inc: { "stock.$.quantity": order[0].items.quantity },
      }
    );
    const result = await Order.updateOne(
      { _id: orderId, "items._id": itemId },
      { $set: { "items.$.status": "Canceled" } }
    );
    resolve(result);
  });
};

const orderReturnHelper = (orderId, itemId) => {
  return new Promise(async (resolve, reject) => {
    const order = await Order.aggregate([
      { $unwind: "$items" },
      {
        $match: {
          _id: new ObjectId(orderId),
          "items._id": new ObjectId(itemId),
        },
      },
    ]);

    const product = await Product.updateOne(
      { _id: order[0].items.product, "stock.size": order[0].items.size },
      {
        $inc: { "stock.$.quantity": order[0].items.quantity },
      }
    );

    const result = await Order.updateOne(
      { _id: orderId, "items._id": itemId },
      {
        $set: {
          "items.$.status": "Return",
        },
      }
    );
    resolve(result);
  });
};

const getAllOrders = () => {
  return new Promise(async (resolve, reject) => {
    const result = await Order.find()
      .populate("items.product")
      .populate("user");
    resolve(result);
  });
};

const changeOrderStatusHelper = (orderId, itemId, data) => {
  return new Promise(async (resolve, reject) => {
    const updateStatus = await Order.updateOne(
      { _id: orderId, "items._id": itemId },
      { $set: { "items.$.status": data.status } }
    );
    resolve(updateStatus);
  });
};

module.exports = {
  placeOrderHelper,
  orderUserHelper,
  orderDetailsHelper,
  orderCancelHelper,
  getAllOrders,
  changeOrderStatusHelper,
  orderReturnHelper,
  orderDetailsUserHelper,
};
