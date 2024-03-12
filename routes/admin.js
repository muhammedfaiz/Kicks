const express = require("express");
const router = express.Router();
const adminController = require("../controller/admin/adminController");
const adminAuthConroller = require("../controller/admin/authController");
const productController = require("../controller/admin/productController");
const categoryController = require("../controller/admin/categoryController");
const userController = require("../controller/admin/userController");
const orderController = require("../controller/admin/orderController");
const couponController = require("../controller/admin/couponController");
const offerController = require("../controller/admin/offerController");
const salesReportController = require("../controller/admin/salesReportController");
const middleware = require("../middlewares/adminMiddleware");

router.get("/", middleware.notLogin, adminAuthConroller.loginLoad);

router.post("/", adminAuthConroller.loginSubmit);

router.get("/dashboard", middleware.isLogin, adminController.dashboardLoad);

router.get("/logout", adminAuthConroller.adminLogout);

router.get("/product-list", middleware.isLogin, productController.productList);

router.get(
  "/product-add",
  middleware.isLogin,
  productController.productAddLoad
);

router.post(
  "/product-add",
  middleware.upload.array("images"),
  productController.productAdd
);

router.patch("/product-status/:id", productController.productStatusHandle);

router.get(
  "/product-edit/:id",
  middleware.isLogin,
  productController.productEditHandler
);

router.put(
  "/product-edit/:id",
  middleware.upload.array("images"),
  productController.productEdit
);

router.delete("/product-delete/:id", productController.productDeletion);

router.get(
  "/category-list",
  middleware.isLogin,
  categoryController.categoryList
);

router.get(
  "/category-add",
  middleware.isLogin,
  categoryController.categoryAddLoad
);

router.post("/category-add", categoryController.categoryAdd);

router.get(
  "/category-edit/:id",
  middleware.isLogin,
  categoryController.categoryEditLoad
);

router.put("/category-edit/:id", categoryController.categoryEdit);

router.patch("/category-remove/:id", categoryController.categoryRemove);

router.delete("/category-delete/:id", categoryController.categoryDelete);

router.get("/user-list", middleware.isLogin, userController.userList);

router.patch("/user-status/:id", userController.userStatus);

router.get("/order-list", middleware.isLogin, orderController.orderList);

router.get(
  "/order-return",
  middleware.isLogin,
  orderController.returnOrdersList
);

router.patch("/order-returned/:orderId/:itemId", orderController.orderReturned);

router.get(
  "/order-details/:orderId",
  middleware.isLogin,
  orderController.orderDetails
);

router.patch(
  "/order-status/:orderId/:itemId",
  orderController.changeOrderStatus
);

router.get("/coupon", middleware.isLogin, couponController.couponList);

router.get("/coupon-add", middleware.isLogin, couponController.couponAddLoad);

router.post("/coupon-add", couponController.couponAdd);

router.get(
  "/coupon-edit/:id",
  middleware.isLogin,
  couponController.couponEditLoad
);

router.put("/coupon-edit/:id", couponController.couponEdit);

router.patch("/coupon-status/:id", couponController.changeCouponStatus);

router.delete("/coupon-delete/:id",couponController.couponDelete);

router.get("/offer-add", middleware.isLogin, offerController.offerAddLoad);

router.post("/offer-add", offerController.offerAdd);

router.get("/offer-list", middleware.isLogin, offerController.offerList);

router.patch("/offer-status/:id", offerController.offerStatus);

router.get(
  "/offer-edit/:id",
  middleware.isLogin,
  offerController.offerEditLoad
);

router.put("/offer-edit/:id", offerController.offerEdit);

router.get(
  "/sales-report",
  middleware.isLogin,
  salesReportController.generateSalesReport
);

router.delete("/offer-delete/:id", offerController.deleteOffer);

router.get("/chart-data", salesReportController.getSalesData);

module.exports = router;
