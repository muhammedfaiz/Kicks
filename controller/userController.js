const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const nodeMailer = require("nodemailer");
// password Hashing
const passwordHash = async (password) => {
  try {
    return bcrypt.hash(password, 10);
  } catch (error) {
    console.log(error);
  }
};

// load login page
const loginLoad = async (req, res) => {
  try {
    const error=req.query.error;
    res.render("frontend/login",{error:error});
  } catch (error) {
    console.log("Error:", error);
  }
};

//login submit
const loginSubmit = async (req,res)=>{
  let user=await User.findOne({email: req.body.email});
  if(user){
    const passCompare = await bcrypt.compareSync(req.body.password,user.password);
  if(passCompare){
    res.redirect('/');
  }
  }else{
    res.redirect('/login?error=Invalid user email or password');
  }
} 

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
    const user = await req.body;
    // check if user already exists or not
    let userEmailExist = await User.findOne({ email: user.email });
    let userMobileExist = await User.findOne({ mobile: user.mobile });
    if (userEmailExist) {
      return res.redirect(`/signup?error="User email already exists"`);
    } else if (userMobileExist) {
      return res.redirect(`/signup?error="User Already Exist with mobile"`);
    } else {
      req.session.user = user;
      res.redirect("/otp-verify");
    }
  } catch (error) {
    console.log(error);
  }
};

// otpVerify load
const otpLoad = async (req, res) => {
  try {
    const user = req.session.user;
    let otp = "";
    const error = req.query.err;
    if (!error) {
      for (let i = 0; i < 6; i++) {
        otp += Math.floor(Math.random() * 10);
      }
      req.session.otp = otp;
      req.session.otpExpiration=Date.now()+60*1000;
      console.log(req.session.otp);
      const transporter = nodeMailer.createTransport({
        service: "gmail",
        host: "smtp.gmail.com",
        port: 587,
        secure: false,
        auth: {
          user: process.env.USER,
          pass: process.env.PASSWORD,
        },
      });

      const info = await transporter.sendMail({
        from: {
          name: "Kicks",
          address: process.env.USER,
        },
        to: user.email,
        subject: "Otp verification",
        text: req.session.otp,
      });
    }
    res.render("frontend/otp", { error: error });
  } catch (error) {
    console.log(error);
  }
};

// otp verification
const otpSubmit = async (req, res) => {
  const user = req.session.user;
  const enteredOtp = req.body.otp;

  if (enteredOtp === req.session.otp) {
    const newUser = await User.create({
      name: user.name,
      email: user.email,
      password: await passwordHash(user.password),
      mobile: user.mobile,
    });
    if (newUser.email === user.email) {
      delete req.session.user;
      delete req.session.otp;
      delete req.session.otpExpiration;
      req.session.user_id = newUser._id;
      res.redirect("/");
    }
  } else {
    res.redirect("/otp-verify?err=Wrong+OTP");
  }
};

// Home serving
const homeLoad=(req,res)=>{
  res.render('frontend/home');
}

module.exports = {
  loginLoad,
  loginSubmit,
  signupLoad,
  submitSignup,
  otpLoad,
  otpSubmit,
  homeLoad
};
