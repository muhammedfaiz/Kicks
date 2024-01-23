const User = require("../models/userModel");
const userHelper = require("../helpers/userHelper");
const otpHelper = require("../helpers/otpHelper");

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
    res.render("frontend/otp",{error:""});
  } catch (error) {
    if(error==="Invalid OTP"){
      res.render("frontend/otp",{error:error});
    }else{
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
    if(newUser.email === user.email){
      delete req.session.user;
      delete req.session.otp;
      delete req.session.otpExpiration;
      req.session.userId = newUser._id;
      res.redirect("/");
    }else{
      console.log(newUser);
      res.redirect(`/otp-verify?err=${newUser}`);
    }
  } catch (error) {
    console.log(error);
  }
};

// Home serving
const homeLoad = (req, res) => {
  try {
    res.render("frontend/home");
  } catch (error) {
    console.log(error);
  }
};

// logout
const logoutHandle = (req, res) => {
  try {
    req.session.destroy();
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
  logoutHandle,
};
