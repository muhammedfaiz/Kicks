const orderHelper = require("../../helpers/orderHelper");
const productHelper = require("../../helpers/productHelper");
const moment = require("moment");

// Gets all orders
const orderList = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = 5;
    const orders = await orderHelper.getAllOrders(page,pageSize);
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
    if(req.body.status==="Returned"){
      await orderHelper.orderReturnedHelper(orderId,itemId);
    }
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

const returnOrdersList = async(req,res)=>{
  try {
    const page = parseInt(req.query.page)||1;
    const pageSize = 5;
    const orders = await orderHelper.getAllReturns(page,pageSize);
    for (const order of orders) {
      order.orderedDate = moment(order.orderedOn).format("DD-MM-YYYY");
    }
    res.render('backend/orderReturn',{orders});
  } catch (error) {
    console.log(error);
  }
}

const orderReturned = async(req,res)=>{
  try {
    const orderId = req.params.orderId;
    const itemId = req.params.itemId;
    const data = await orderHelper.orderReturnedHelper(orderId,itemId);
    if(data){
      res.json({status:true});
    }else{
      res.json({status:false});
    }
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  orderList,
  orderDetails,
  changeOrderStatus,
  returnOrdersList,
  orderReturned
};
