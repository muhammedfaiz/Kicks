const orderHelper = require("../../helpers/orderHelper");
const productHelper = require("../../helpers/productHelper");
const moment = require("moment");

// Gets all orders
const orderList = async (req, res) => {
  try {
    const orders = await orderHelper.getAllOrders();
    for (let order of orders) {
      order.allTotal = productHelper.currencyFormatter(
        Math.round(order.total)
      );
      const formatedDate = moment(order.orderedOn).format("MMMM Do,YYYY");
      order.orderedDate = formatedDate;
    }
    res.render("backend/orderList", { orders: orders });
  } catch (error) {
    console.log(error);
  }
};

// get details of a specific orders
const orderDetails = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const details = await orderHelper.orderDetailsHelper(orderId);
    details.orderedDate = moment(details.orderedOn).format("MMMM Do,YYYY");

    for (const item of details.items) {
      item.offerPrice = productHelper.currencyFormatter(Math.round(item.price));
    }

    details.allTotal = productHelper.currencyFormatter(Math.round(details.total));
    res.render("backend/orderDetails", { details: details });
  } catch (error) {
    console.log(error);
  }
};

// changes the status of the order
const changeOrderStatus = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const itemId = req.params.itemId;
    const result = await orderHelper.changeOrderStatusHelper(
      orderId,
      itemId,
      req.body
    );
    if (result) {
      res.json({ status: true });
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  orderList,
  orderDetails,
  changeOrderStatus,
};
