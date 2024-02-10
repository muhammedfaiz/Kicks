const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');
const middleware = require('../middlewares/userMiddleware');


router.get('/login',middleware.notLogin,userController.loginLoad);

router.post('/login',userController.loginSubmit)

router.get('/signup',userController.signupLoad);

router.post('/signup',userController.submitSignup);

router.get('/otp-verify',userController.otpLoad);

router.post('/otp-verify',middleware.otpTimeExpiry,userController.otpSubmit);

router.get('/',middleware.isLogin,userController.homeLoad);

router.get('/product-view/:id',middleware.isLogin,userController.productView);

router.post('/cart/:id/:size',userController.addToCart);

router.get('/cart',middleware.isLogin,userController.getAllCart);

router.patch("/cart/:click/:id",userController.updateQuantity);

router.delete("/cart-item/:id",userController.deleteCart);

router.get('/user/:id',middleware.isLogin,userController.getUserProfile);

router.put('/add-address',userController.addressAdd);

router.put("/delete-address/:id",userController.addressDelete);

router.put("/edit-user",userController.editUserDetails);

router.get("/checkout",middleware.isLogin,userController.checkoutCart);

router.post('/place-order',userController.placeOrder);

router.get('/order-placed',middleware.isLogin,userController.orderSuccess);

router.patch('/order-cancel/:id',userController.orderCancel);

router.get('/logout',userController.logoutHandle);


module.exports=router;