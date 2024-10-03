const userHelper = require("../../helpers/userHelper");
const otpHelper = require("../../helpers/otpHelper");

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

// logout
const logoutHandle = (req, res) => {
  try {
    delete req.session.userId;
    res.redirect("/login");
  } catch (error) {
    console.log(error);
  }
};

const forgetPassLoad = (req, res) => {
  try {
    const error = req.query.error;
    const msg = req.query.msg;
    res.render("frontend/forgotPass", { error: error, msg: msg });
  } catch (error) {
    console.log(error);
  }
};

const forgetPass = async (req, res) => {
  try {
    const { email } = req.body;
    const user = await userHelper.getUserEmailHelper(email);
    if (user && user.email == email) {
      // generate one time link using jsonwebtoken
      const link = await userHelper.createWebtoken(
        user._id,
        user.email,
        user.password
      );
      const sendMail = await otpHelper.sendResetLink(link, user.email);
      if (sendMail) {
        console.log(sendMail);
        res.redirect(
          "/forgot-password?msg=Check for the reset password link in the given email"
        );
      } else {
        res.redirect("/forgot-password?error=Some error occured");
      }
    } else {
      res.redirect("/forgot-password?error=Email does not exist");
    }
  } catch (error) {
    console.log(error);
  }
};

const resetPasswordLoad = async (req, res) => {
  try {
    const { id, token } = req.params;
    const error = req.query.error;
    const msg = req.query.msg;
    const user = await userHelper.getUserHelper(id);
    if (user) {
      const verifyToken = await userHelper.createTokenVerify(
        token,
        user.password
      );
      if (verifyToken) {
        res.render("frontend/resetPass", { email: user.email, error, msg });
      } else {
        res.send("Something went wrong");
      }
    }
  } catch (error) {
    console.log(error);
  }
};

const resetPassword = async (req, res) => {
  try {
    const { id, token } = req.params;
    const user = await userHelper.getUserHelper(id);
    if (user) {
      const verifyToken = await userHelper.createTokenVerify(
        token,
        user.password
      );
      if (verifyToken) {
        const { password, cpassword } = req.body;
        if (password === cpassword) {
          const updatePassword = await userHelper.resetPasswordHelper(
            user._id,
            password
          );
          if (updatePassword) {
            res.send(
              `Password Changed successfully`
            );
          } else {
            res.redirect(
              `/reset-password/${id}/${token}?error=Some error occurred`
            );
          }
        } else {
          res.redirect(
            `/reset-password/${id}/${token}?error=Password doesnt match`
          );
        }
      }
    }
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
  logoutHandle,
  forgetPassLoad,
  forgetPass,
  resetPasswordLoad,
  resetPassword,
};
