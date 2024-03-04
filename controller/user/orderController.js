const orderHelper = require("../../helpers/orderHelper");
const cartHelper = require("../../helpers/cartHelper");
const productHelper = require("../../helpers/productHelper");
const userHelper = require("../../helpers/userHelper");
const couponHelper = require("../../helpers/couponHelper");
const path = require("path");

// checkout load from cart
const checkoutCart = async (req, res) => {
  try {
    const user = req.session.userId;
    const result = await cartHelper.checkoutgetCart(user);
    const userDetails = await userHelper.getUserHelper(user);
    const coupons = await couponHelper.getUserCoupons(user);
    if (result) {
      for (let i = 0; i < result.items.length; i++) {
        const offerPrice =
          result.items[i].product.price -
          (result.items[i].product.price * result.items[i].product.discount) /
            100;
        let total = result.items[i].quantity * offerPrice;
        result.items[i].subTotal = productHelper.currencyFormatter(
          Math.round(total)
        );
        result.items[i].offerPrice = productHelper.currencyFormatter(
          Math.round(offerPrice)
        );
      }
      const allTotal = productHelper.currencyFormatter(result.total);
      result.allTotal = allTotal;
      res.render("frontend/checkout", {
        cart: result,
        user: user,
        userDetails: userDetails,
        coupons: coupons,
      });
    }
  } catch (error) {
    console.log(error);
  }
};
// place order
const placeOrder = async (req, res) => {
  try {
    if (req.body.payment == "COD") {
      const result = await orderHelper.placeOrderHelper(
        req.body,
        req.session.userId,
        "Pending"
      );
      if (result) {
        const cart = await cartHelper.emptyCart(req.session.userId);
        if (cart) {
          res.json({ success: true });
        }
      }
    } else if (req.body.payment == "razorpay") {
      const cart = await cartHelper.getUserCart(req.session.userId);
      const data = await orderHelper.generateRazorpay(cart);
      const user = await userHelper.getUserHelper(req.session.userId);
      res.json({ data: data, user: user });
    }
  } catch (error) {
    console.log(error);
  }
};

// render order-success page
const orderSuccess = (req, res) => {
  try {
    res.render("frontend/orderPlace", { user: req.session.userId });
  } catch (error) {
    console.log(error);
  }
};

// get order Details
const getOrderDetails = async (req, res) => {
  try {
    const orderId = req.params.id;
    const userId = req.session.userId;
    const orders = await orderHelper.orderDetailsUserHelper(orderId, userId);
    orders.orderTotal = productHelper.currencyFormatter(
      Math.round(orders.total)
    );
    for (const item of orders.items) {
      item.offerPrice = productHelper.currencyFormatter(Math.round(item.price));
    }
    await orderHelper.generateInvoice(orders);
    if (orders) {
      res.render("frontend/orderDetails", { data: orders, user: userId });
    }
  } catch (error) {
    console.log(error);
  }
};

//  get the order history of a user
const orderCancel = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const itemId = req.params.itemId;
    const result = await orderHelper.orderCancelHelper(
      orderId,
      itemId,
      req.session.userId
    );
    if (result) {
      res.json({ status: true });
    }
  } catch (error) {
    console.log(error);
  }
};

const orderReturn = async (req, res) => {
  try {
    const orderId = req.params.orderId;
    const itemId = req.params.itemId;
    const result = await orderHelper.orderReturnHelper(orderId, itemId);
    if (result) {
      res.json({ status: true });
    }
  } catch (error) {
    console.log(error);
  }
};

const verifyOnlinePayment = async (req, res) => {
  try {
    req.session.data = req.body.data;
    const verify = await orderHelper.verifyPaymentHelper(req.body);
    if (verify) {
      const data = req.session.data;
      if(data.orderId){
        const result = await orderHelper.payLaterHelper(data.orderId);
        if(result){
          res.json({success:true});
        }else{
          res.json({success:false});
        }
      }else{
        const result = await orderHelper.placeOrderHelper(
          data,
          req.session.userId,
          "Pending"
        );
        if (result) {
          const cart = await cartHelper.emptyCart(req.session.userId);
          if (cart) {
            res.json({ success: true });
          }
        }
      }
      delete req.session.data;
    } else {
      const data = req.session.data;
      const result = await orderHelper.placeOrderHelper(
        data,
        req.session.userId,
        "Payment Pending"
      );
      if (result) {
        const cart = await cartHelper.emptyCart(req.session.userId);
        if (cart) {
          res.json({ orderId: result._id });
          delete req.session.data;
        }
      }
    }
  } catch (error) {
    console.log(error);
  }
};

const invoiceGenerator = async (req, res) => {
  try {
    const order = await orderHelper.orderDetailsHelper(req.params.id);
    if (order) {
      const invoicePath = path.join(
        __dirname,
        "../../public/invoice",
        `invoice-${order.orderId}.pdf`
      );
      res.download(invoicePath);
    }
  } catch (error) {
    console.log(error);
  }
};

const payLater = async (req, res) => {
  try {
    const data = await orderHelper.generateRazorpay({total:req.body.price,user:req.session.userId});
    const user = await userHelper.getUserHelper(req.session.userId);
    res.json({ data: data, user: user });
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  checkoutCart,
  placeOrder,
  orderSuccess,
  orderCancel,
  orderReturn,
  getOrderDetails,
  verifyOnlinePayment,
  invoiceGenerator,
  payLater,
};
