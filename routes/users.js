const express = require('express');
const router = express.Router();
const userController = require('../controller/userController');


router.get('/login',userController.loginLoad);

router.get('/signup',userController.signupLoad);

router.post('/signup',userController.submitSignup);

router.get('/otp-verify',userController.otpLoad);

module.exports=router;