const User = require('../models/userModel');
const isLogin = (req, res, next) => {
  if (!req.session.userId) {
    res.redirect("/");
  } else {
    next();
  }
};

const notLogin = (req, res, next) => {
  if (req.session.userId) {
    res.redirect("/");
  } else {
    next();
  }
};

const otpTimeExpiry = (req, res, next) => {
  if (Date.now() >= req.session.otpExpiration) {
    res.redirect("/otp-verify?err=Wrong+OTP");
  } else {
    next();
  }
};

const toLogin = (req,res,next)=>{
  if(!req.session.userId){
    res.redirect("/login");
  }else{
    next();
  }
}

module.exports = { isLogin, otpTimeExpiry, notLogin ,toLogin};
