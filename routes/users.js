const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');
const middleware = require('../middlewares/middleware');


router.get('/login',userController.loginLoad);

router.post('/login',userController.loginSubmit)

router.get('/signup',userController.signupLoad);

router.post('/signup',userController.submitSignup);

router.get('/otp-verify',userController.otpLoad);

router.post('/otp-verify',middleware.otpTimeExpiry,userController.otpSubmit);

router.get('/',userController.homeLoad);

module.exports=router;