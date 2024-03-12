const Order = require("../models/orderModel");
const Cart = require("../models/cartModel");
const User = require("../models/userModel");
const Product = require("../models/productModel");
const Coupon = require("../models/couponModel");
const ObjectId = require("mongoose").Types.ObjectId;
const Razorpay = require("razorpay");
const crypto = require("crypto");
const path = require("path");
const PDFDocument = require("pdfkit");
const fs = require("fs");
const moment = require("moment");

const placeOrderHelper = (data, userId, status) => {
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
          discount: cart.items[i].discount,
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
          coupon: cart.coupon,
          couponDiscount: cart.couponDiscount,
          originalTotal: cart.originalTotal,
          status: status,
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
      const data = await Order.find({ user: userId })
        .sort({ orderedOn: -1 })
        .populate("items.product");
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

const orderCancelHelper = (orderId, itemId, userId) => {
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

    if (order[0].paymentMethod === "razorpay") {
      const user = await User.findById(userId);
      let date = new Date();
      const updateWallet = await User.updateOne(
        { _id: new ObjectId(userId) },
        {
          $set: {
            "wallet.balance": user.wallet.balance + Math.round(order[0].total),
          },
          $push: {
            "wallet.details": {
              type: "refund",
              amount: Number(Math.round(order[0].total)),
              date: date,
            },
          },
        },
        { upsert: true }
      );
    }
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

const getAllOrders = (page, pageSize) => {
  return new Promise(async (resolve, reject) => {
    const skip = (page - 1) * pageSize;
    const result = await Order.find()
      .populate("items.product")
      .populate("user")
      .sort({ orderedOn: -1 })
      .skip(skip)
      .limit(pageSize);
    resolve(result);
  });
};

const changeOrderStatusHelper = (orderId, itemId, data) => {
  return new Promise(async (resolve, reject) => {
    const updateStatus = await Order.updateOne(
      { _id: orderId, "items._id": itemId },
      { $set: { "items.$.status": data.status } }
    );
    const order = await Order.findById(orderId);
    const hasDeliveredItem = order.items.some(
      (item) => item.status === "Delivered"
    );
    const allOtherItemsValid = order.items.every(
      (item) => item.status !== "Pending" && item.status !== "Shipped"
    );
    if (hasDeliveredItem && allOtherItemsValid) {
      order.status = "Delivered";
      order.save();
    }
    resolve(updateStatus);
  });
};

const generateRazorpay = (cart) => {
  return new Promise(async (resolve, reject) => {
    try {
      var instance = new Razorpay({
        key_id: process.env.RAZOR_PAY_KEY_ID,
        key_secret: process.env.RAZOR_PAY_SECERET_KEY,
      });
      var options = {
        amount: Math.round(cart.total) * 100,
        currency: "INR",
        receipt: String(cart.user),
      };
      instance.orders.create(options, function (err, order) {
        if (err) {
          console.log(err);
        }
        resolve(order);
      });
    } catch (error) {
      console.log(error);
    }
  });
};

const verifyPaymentHelper = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const hmac = crypto.createHmac(
        "sha256",
        process.env.RAZOR_PAY_SECERET_KEY
      );
      hmac.update(
        data.payment.razorpay_order_id + "|" + data.payment.razorpay_payment_id
      );
      let digestHmac = hmac.digest("hex");
      if (digestHmac === data.payment.razorpay_signature) {
        resolve(true);
      } else {
        resolve(false);
      }
    } catch (error) {
      console.log(error);
    }
  });
};

const getAllReturns = (page, pageSize) => {
  return new Promise(async (resolve, reject) => {
    try {
      const skip = (page - 1) * pageSize;
      const result = await Order.aggregate([
        { $unwind: "$items" },
        {
          $lookup: {
            from: "products",
            as: "items.product",
            foreignField: "_id",
            localField: "items.product",
          },
        },
        { $match: { "items.status": "Return" } },
        { $skip: skip },
        { $limit: pageSize },
      ]);
      resolve(result);
    } catch (error) {
      console.log(error);
    }
  });
};

const orderReturnedHelper = (orderId, itemId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const order = await Order.updateOne(
        { _id: orderId, "items._id": itemId },
        { $set: { "items.$.status": "Returned" } }
      );
      if (order.modifiedCount > 0) {
        resolve(true);
      }
    } catch (error) {
      console.log(error);
    }
  });
};

const generateInvoice = async (order) => {
  const doc = new PDFDocument();
  const filePath = path.join(
    __dirname,
    "../public/invoice",
    `invoice-${order.orderId}.pdf`
  );
  const writeStream = fs.createWriteStream(filePath);
  doc.pipe(writeStream);

  // Set font and color
  doc.font("Helvetica-Bold").fontSize(20).fillColor("#333");

  // Add header with centered text
  doc.text("Invoice", { align: "center" });

  // Add invoice number
  doc.moveDown().fontSize(12).text(`Invoice Number: ${order.orderId}`);

  // Add product details with a table-like structure
  doc.moveDown().fontSize(12);

  // Header row
  doc.font("Helvetica-Bold");
  doc.text("Product", 50, 140);
  doc.text("Quantity", 200, 140);
  doc.text("Price", 300, 140);

  // Data rows
  doc.font("Helvetica");
  let yPosition = 180;
  // Adjust this value based on your layout
  for (const item of order.items) {
    doc.text(item.product.name, 50, yPosition);
    doc.text(item.quantity.toString(), 200, yPosition);
    doc.text(`Rs.${Math.round(item.price)}`, 300, yPosition);
    yPosition += 20; // Adjust this value based on your layout
  }
  if (order.coupon) {
    doc
      .moveDown()
      .fontSize(16)
      .font("Helvetica-Bold")
      .text(`Original Total: Rs.${order.originalTotal}`, 200, yPosition + 20);
    doc.text(`Coupon Discount: Rs.${order.couponDiscount}`, 200, yPosition + 40);
    doc.text(`Current Total: Rs.${order.total}`, 200, yPosition + 60);
    yPosition += 80;
  } else {
    doc
      .moveDown()
      .fontSize(16)
      .font("Helvetica-Bold")
      .text(`Total:${order.total}`, 260, yPosition);

    yPosition += 40;
  }
  // Add company and client information
  doc.moveDown().fontSize(12).text("Company: Kicks", 50, yPosition);
  doc.text("Address: Kanjirapuzha, Mannarkkad, India");
  doc.text(`To: ${order.address.name}`);
  doc.text(
    `Address: ${order.address.house}, ${order.address.city}, ${order.address.country}`
  );

  // Add invoice date
  const orderedOn = moment(order.orderedOn).format("DD-MM-YYYY");
  doc.text(`Invoice Date: ${orderedOn}`);

  // Finalize the PDF document
  doc.end();

  writeStream.on("error", (err) => {
    console.error("Error creating invoice PDF:", err);
  });
};

const payLaterHelper = (orderId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const order = await Order.findOne({ _id: orderId });
      order.status = "Pending";
      order.save();
      resolve(order);
    } catch (error) {
      console.log(error);
    }
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
  generateRazorpay,
  verifyPaymentHelper,
  getAllReturns,
  orderReturnedHelper,
  generateInvoice,
  payLaterHelper,
};
