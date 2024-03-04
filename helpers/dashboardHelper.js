const Order = require("../models/orderModel");

const topProductHelper = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const products = await Order.aggregate([
        {
          $unwind: "$items",
        },
        {
          $lookup: {
            from: "products",
            as: "items.product",
            localField: "items.product",
            foreignField: "_id",
          },
        },
        {
          $group: {
            _id: "$items.product",
            totalQuantity: { $sum: "$items.quantity" },
          },
        },
        {
          $project: {
            _id: 0,
            name: "$_id.name",
            images: "$_id.images",
            totalQuantity: 1,
          },
        },
        {
          $sort: { totalQuantity: -1 },
        },
        {
          $limit: 10,
        },
      ]);
      resolve(products);
    } catch (error) {
      console.log(error);
    }
  });
};

const topCategoryHelper = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const categories = await Order.aggregate([
        {
          $unwind: "$items",
        },
        {
          $lookup: {
            from: "products",
            as: "items.product",
            localField: "items.product",
            foreignField: "_id",
          },
        },
        {
          $unwind: "$items.product",
        },
        {
          $lookup: {
            from: "categories",
            as: "items.product.category",
            foreignField: "_id",
            localField: "items.product.category",
          },
        },
        {
          $group: {
            _id: "$items.product.category",
            totalQuantity: { $sum: "$items.quantity" },
          },
        },
        {
          $project: {
            _id: 0,
            name: "$_id.name",
            totalQuantity: 1,
          },
        },
        {
          $sort: { totalQuantity: -1 },
        },
        {
          $limit: 10,
        },
      ]);
      resolve(categories);
    } catch (error) {
      console.log(error);
    }
  });
};

module.exports = { topProductHelper, topCategoryHelper };
