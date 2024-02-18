const express = require("express");
const router = express.Router();
const userController = require("../controller/user/userController");
const userAuthController = require("../controller/user/authController");
const productController = require("../controller/user/productController");
const cartController = require("../controller/user/cartController");
const orderController = require("../controller/user/orderController");
const wishListController = require("../controller/user/wishListController");
const couponController = require("../controller/user/couponController");
const middleware = require("../middlewares/userMiddleware");

router.get("/login", middleware.notLogin, userAuthController.loginLoad);

router.post("/login", userAuthController.loginSubmit);

router.get("/signup", middleware.notLogin, userAuthController.signupLoad);

router.post("/signup", userAuthController.submitSignup);

router.get("/otp-verify", middleware.notLogin, userAuthController.otpLoad);

router.post(
  "/otp-verify",
  middleware.otpTimeExpiry,
  userAuthController.otpSubmit
);

router.get("/", middleware.isLogin, userController.homeLoad);

router.get(
  "/product-view/:id",
  middleware.isLogin,
  productController.productView
);

router.post("/cart/:id/:size", productController.addToCart);

router.get("/cart", middleware.isLogin, cartController.getAllCart);

router.patch("/cart/:click/:id", cartController.updateQuantity);

router.delete("/cart-item/:id", cartController.deleteCart);

router.get("/user/:id", middleware.isLogin, userController.getUserProfile);

router.put("/add-address", userController.addressAdd);

router.put("/delete-address/:id", userController.addressDelete);

router.get(
  "/edit-address/:id",
  middleware.isLogin,
  userController.editAddressLoad
);

router.put("/edit-address/:id", userController.editAddress);

router.put("/edit-user", userController.editUserDetails);

router.get("/checkout", middleware.isLogin, orderController.checkoutCart);

router.post("/place-order", orderController.placeOrder);

router.get("/order-placed", middleware.isLogin, orderController.orderSuccess);

router.get("/order-detail/:id",middleware.isLogin,orderController.getOrderDetails);

router.patch("/order-cancel/:orderId/:itemId", orderController.orderCancel);

router.patch("/order-return/:orderId/:itemId", orderController.orderReturn);

router.put("/wish-list/:id", wishListController.wishListAdd);

router.patch("/removeWishList/:id", wishListController.removeWishList);

router.get("/wish-list", middleware.isLogin, wishListController.wishListView);

router.get("/logout", userAuthController.logoutHandle);

router.post('/apply-coupon',couponController.applyCoupon);

module.exports = router;
