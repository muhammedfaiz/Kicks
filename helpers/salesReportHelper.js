const Order = require("../models/orderModel");

const getSalesData = (startDate, endDate) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (startDate && endDate) {
        const startOfDay = new Date(startDate);
        startOfDay.setHours(0, 0, 0);

        const endOfDay = new Date(endDate);
        endOfDay.setHours(23, 59, 59);
        const orders = await Order.find({
          status: "Delivered",
          orderedOn: { $gte: startOfDay, $lte: endOfDay },
        })
          .populate("items.product")
          .sort({ orderedOn: -1 });
        const salesSummary = await Order.aggregate([
          {
            $match: {
              status: "Delivered",
              orderedOn: { $gte: startOfDay, $lte: endOfDay },
            },
          },
          {
            $group: {
              _id: null,
              totalRevenue: { $sum: "$total" },
              sales: { $sum: 1 },
            },
          },
        ]);
        resolve({ orders, salesSummary: salesSummary[0] });
      } else {
        const orders = await Order.find({ status: "Delivered" })
          .populate("items.product")
          .sort({ orderedOn: -1 });
        const salesSummary = await Order.aggregate([
          {
            $match: {
              status: "Delivered",
            },
          },
          {
            $group: {
              _id: null,
              totalRevenue: { $sum: "$total" },
              sales: { $sum: 1 },
            },
          },
        ]);

        resolve({ orders, salesSummary: salesSummary[0] });
      }
    } catch (error) {
      console.log(error);
    }
  });
};

const getChartDataPerMonth = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const result = await Order.aggregate([
        {
          $match: {
            status: "Delivered",
            orderedOn: {
              $gte: new Date(new Date().getFullYear(), 0, 1),
              $lte: new Date(new Date().getFullYear() + 1, 0, 1),
            },
          },
        },
        {
          $group: {
            _id: { month: { $month: "$orderedOn" } }, 
            totalOrders: { $sum: 1 },
          },
        },
        {
          $project: {
            _id: 0,
            month: {
              $switch: {
                branches: [
                  { case: { $eq: ["$_id.month", 1] }, then: "Jan" },
                  { case: { $eq: ["$_id.month", 2] }, then: "Feb" },
                  { case: { $eq: ["$_id.month", 3] }, then: "Mar" },
                  { case: { $eq: ["$_id.month", 4] }, then: "Apr" },
                  { case: { $eq: ["$_id.month", 5] }, then: "May" },
                  { case: { $eq: ["$_id.month", 6] }, then: "Jun" },
                  { case: { $eq: ["$_id.month", 7] }, then: "Jul" },
                  { case: { $eq: ["$_id.month", 8] }, then: "Aug" },
                  { case: { $eq: ["$_id.month", 9] }, then: "Sep" },
                  { case: { $eq: ["$_id.month", 10] }, then: "Oct" },
                  { case: { $eq: ["$_id.month", 11] }, then: "Nov" },
                  { case: { $eq: ["$_id.month", 12] }, then: "Dec" },
                ],
                default: "Invalid Month",
              },
            },
            totalOrders: 1,
          },
        },
        {
          $sort: { month: 1 },
        },
      ]);
      resolve(result);
    } catch (error) {
      console.log(error);
    }
  });
};

const getChartDataPerYear = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const data = await Order.aggregate([
        {
          $match: {
            status: "Delivered",
          },
        },
        {
          $group: {
            _id: { year: { $year: "$orderedOn" } },
            totalOrders: { $sum: 1 },
          },
        },
        {
          $project: {
            _id: 0,
            year: "$_id.year",
            totalOrders: 1,
          },
        },
        {
          $sort: { year: 1 }, 
        },
      ]);

     
      const ordersPerYear = data.map((item) => {
        return {
          totalOrders: item.totalOrders,
          year: item.year,
        };
      });

      resolve(ordersPerYear);
    } catch (error) {
      reject(error);
    }
  });
};
module.exports = { getSalesData, getChartDataPerMonth, getChartDataPerYear };
