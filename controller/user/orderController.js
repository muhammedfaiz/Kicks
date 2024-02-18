const orderHelper = require("../../helpers/orderHelper");
const cartHelper = require("../../helpers/cartHelper");
const productHelper = require("../../helpers/productHelper");
const userHelper = require("../../helpers/userHelper");
const couponHelper = require("../../helpers/couponHelper");

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
        coupons:coupons
      });
    }
  } catch (error) {
    console.log(error);
  }
};
// place order
const placeOrder = async (req, res) => {
  try {
    const result = await orderHelper.placeOrderHelper(
      req.body,
      req.session.userId
    );
    if (result) {
      const cart = await cartHelper.emptyCart(req.session.userId);
      if (cart) {
        res.json({ url: "/order-placed" });
      }
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
    orders.orderTotal = productHelper.currencyFormatter(Math.round(orders.total));
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
    const result = await orderHelper.orderCancelHelper(orderId, itemId);
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

module.exports = {
  checkoutCart,
  placeOrder,
  orderSuccess,
  orderCancel,
  orderReturn,
  getOrderDetails,
};
