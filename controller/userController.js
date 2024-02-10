const User = require("../models/userModel");
const userHelper = require("../helpers/userHelper");
const otpHelper = require("../helpers/otpHelper");
const productHelper = require("../helpers/productHelper");
const cartHelper = require("../helpers/cartHelper");
const orderHelper = require("../helpers/orderHelper");
const moment = require('moment');

// load login page
const loginLoad = async (req, res) => {
  try {
    const error = req.query.error;
    res.render("frontend/login", { error: error });
  } catch (error) {
    console.log("Error:", error);
  }
};

//login submit
const loginSubmit = async (req, res) => {
  userHelper
    .loginHelper(req.body)
    .then((response) => {
      if (response.isLogin) {
        req.session.userId = response.user._id;
        res.redirect("/");
      }
    })
    .catch((response) => {
      res.redirect(`/login?error=${response.error}`);
    });
};

// load signup page
const signupLoad = async (req, res) => {
  try {
    const error = req.query.error;
    res.render("frontend/register", { error: error });
  } catch (error) {
    console.log("Error:", error);
  }
};

// submit the signup details
const submitSignup = async (req, res) => {
  try {
    const result = await userHelper.signupHelper(req.body);

    if (result.isSignUp) {
      req.session.user = result.user;
      res.redirect("/otp-verify");
    }
  } catch (error) {
    // Check if error has an 'error' property
    const errorMessage = error.error || "An error occurred during signup";
    res.redirect("/signup?error=" + errorMessage);
  }
};

// otpVerify load
const otpLoad = async (req, res) => {
  try {
    const user = req.session.user;
    const error = req.query.err;
    const otp = await otpHelper.otpSender(user.email, error);
    req.session.otp = otp;
    req.session.otpExpiration = Date.now() + 60 * 1000;
    console.log(req.session.otp);
    res.render("frontend/otp", { error: "" });
  } catch (error) {
    if (error === "Invalid OTP") {
      res.render("frontend/otp", { error: error });
    } else {
      console.log(error);
    }
  }
};

// otp verification
const otpSubmit = async (req, res) => {
  try {
    const user = req.session.user;
    const newUser = await otpHelper.otpGetter(
      req.session.otp,
      req.body.otp,
      user
    );
    if (newUser.email === user.email) {
      delete req.session.user;
      delete req.session.otp;
      delete req.session.otpExpiration;
      req.session.userId = newUser._id;
      res.redirect("/");
    } else {
      console.log(newUser);
      res.redirect(`/otp-verify?err=${newUser}`);
    }
  } catch (error) {
    console.log(error);
  }
};

// Home serving
const homeLoad = async (req, res) => {
  try {
    const products = await productHelper.activeProductList();
    for (let i = 0; i < products.length; i++) {
      const offerPrice =
        products[i].price - (products[i].price * products[i].discount) / 100;
      products[i].offerPrice = productHelper.currencyFormatter(
        Math.round(offerPrice)
      );
      products[i].price = productHelper.currencyFormatter(products[i].price);
    }
    res.render("frontend/home", {
      products: products,
      user: req.session.userId,
    });
  } catch (error) {
    console.log(error);
  }
};

// product_view
const productView = async (req, res) => {
  try {
    let id = req.params.id;
    const product = await productHelper.selectedProduct(id);
    const offerPrice = product.price - (product.price * product.discount) / 100;
    product.offerPrice = productHelper.currencyFormatter(
      Math.round(offerPrice)
    );
    product.originalPrice = productHelper.currencyFormatter(product.price);
    const cart = await cartHelper.cartCheck(id, req.session.userId);
    res.render("frontend/product-view", {
      product: product,
      status: cart,
      user: req.session.userId,
    });
  } catch (error) {
    console.log(error);
  }
};

// product added to cart
const addToCart = async (req, res) => {
  try {
    let id = req.params.id;
    let size = req.params.size;
    const result = await cartHelper.addToCartHelper(
      id,
      req.session.userId,
      size
    );
    if (result) {
      res.json({ status: true });
    } else {
      res.json({ status: false });
    }
  } catch (error) {
    console.log(error);
  }
};

// get all products form the cart
const getAllCart = async (req, res) => {
  try {
    const result = await cartHelper.getAllItems(req.session.userId);
    if (result !== false) {
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
      res.render("frontend/cart", { data: result, user: req.session.userId });
    } else {
      res.render("frontend/cart", { user: req.session.userId });
    }
  } catch (error) {
    console.log(error);
  }
};

//update quantity
const updateQuantity = async (req, res) => {
  try {
    let click = req.params.click;
    let id = req.params.id;
    let increaseQuantity;
    if (click === "up") {
      increaseQuantity = 1;
    } else {
      increaseQuantity = -1;
    }
    const update = await cartHelper.updateQuantityHelper(
      increaseQuantity,
      id,
      req.session.userId
    );
    if (update) {
      res.json({ status: true });
    } else {
      res.json({ status: false });
    }
  } catch (error) {
    console.log(error);
  }
};

// delete cart items
const deleteCart = async (req, res) => {
  try {
    const id = req.params.id;
    const deleted = await cartHelper.deleteItemHelper(id, req.session.userId);
    if (deleted) {
      res.json({ status: true });
    } else {
      res.json({ status: false });
    }
  } catch (error) {
    console.log(error);
  }
};

// user profile
const getUserProfile = async (req, res) => {
  try {
    const id = req.params.id;
    const user = req.session.userId;
    const data = await userHelper.getUserHelper(id);
    const order = await orderHelper.orderUserHelper(req.session.userId);
    let quantity=0;
    for (const item of order) {
      const orderDate = moment(item.orderedOn).format("MMMM Do,YYYY")
      item.orderedDate = orderDate;
      item.totalPrice = productHelper.currencyFormatter(item.total);
      for(const product of item.items){
        quantity += Number(product.quantity);
      }
      item.quantity = quantity;
      quantity=0;
    }
    if ((data._id = id && order)) {
      res.render("frontend/profile", { data: data, user: user, orders: order });
    }
  } catch (error) {
    console.log(error);
  }
};
// adds address to user
const addressAdd = async (req, res) => {
  try {
    const id = req.session.userId;
    const result = await userHelper.addAddressHelper(id, req.body);
    if ((result._id = id)) {
      res.json({ status: true });
    } else {
      res.json({ status: false });
    }
  } catch (error) {
    console.log(error);
  }
};
// delete address from user
const addressDelete = async (req, res) => {
  try {
    const id = req.params.id;
    const deleted = await userHelper.deleteAddressHelper(
      req.session.userId,
      id
    );
    if (deleted) {
      res.json({ status: true });
    } else {
      res.json({ status: false });
    }
  } catch (error) {
    console.log(error);
  }
};
// user details edit
const editUserDetails = async (req, res) => {
  try {
    const id = req.session.userId;
    const result = await userHelper.editUserDetailsHelper(id, req.body);
    console.log(result);
    if (result != "password is incorrect") {
      res.json({ status: true });
    } else {
      res.json({ status: false });
    }
  } catch (error) {
    console.log(error);
  }
};

// checkout load from cart
const checkoutCart = async (req, res) => {
  try {
    const user = req.session.userId;
    const result = await cartHelper.getAllItems(user);
    const userDetails = await userHelper.getUserHelper(user);
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

//  get the order history of a user
const orderCancel = async (req, res) => {
  try {
    const orderId = req.params.id;
    const result = await orderHelper.orderCancelHelper(orderId);
    if(result){
      res.json({status:true});
    }
  } catch (error) {
    console.log(error);
  }
};


// logout
const logoutHandle = (req, res) => {
  try {
    delete req.session.userId;
    res.redirect("/login");
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  loginLoad,
  loginSubmit,
  signupLoad,
  submitSignup,
  otpLoad,
  otpSubmit,
  homeLoad,
  productView,
  addToCart,
  getAllCart,
  updateQuantity,
  deleteCart,
  getUserProfile,
  addressAdd,
  addressDelete,
  editUserDetails,
  checkoutCart,
  placeOrder,
  orderSuccess,
  orderCancel,
  logoutHandle,
};
