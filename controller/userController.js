const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const otpVerified = false;
const nodeMailer = require('nodemailer');
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
    res.render("frontend/login");
  } catch (error) {
    console.log("Error:", error);
  }
};

// load signup page
const signupLoad = async (req, res) => {
  try {
    const error= req.query.error;
    res.render("frontend/register",{error:error});
  } catch (error) {
    console.log("Error:", error);
  }
};

// submit the signup details
const submitSignup = async (req, res) => {
  try {
    const { name, email, mobile, password } = await req.body;
    // check if user already exists or not
    let userEmailExist = await User.findOne({ email: email });
    let userMobileExist = await User.findOne({ mobile: mobile });
    if (userEmailExist) {
      return res.redirect(`/signup?error="User email already exists"`)
    } else if (userMobileExist) {
      return res.redirect(`/signup?error="User Already Exist with mobile"`);
    } else {
        req.session.userMail = email;
        res.redirect("/otp-verify");
      if (otpVerified === true) {
        const pass = await passwordHash(password);
        const newUser = await User.create({
        name: name,
        email: email,
        mobile: mobile,
        password: pass,
      });
      }
    }
  } catch (error) {
    console.log(error);
  }
};

// otpVerify load
const otpLoad = async (req, res) => {
  try {
    const userMail = req.session.userMail;
    let otp='';
    for(let i = 0 ;i<6;i++){
        otp += Math.floor(Math.random()*10);
    }
    

    const transporter = nodeMailer.createTransport({
        service:'gmail',
        host: 'smtp.gmail.com',
        port: 587,
        secure:false,
        auth: {
            user: process.env.USER,
            pass: process.env.PASSWORD
        }
    });

    const info = await transporter.sendMail({
        from:{
            name:"Kicks",
            address:process.env.USER
        },
        to:userMail,
        subject:"Otp verification",
        text:otp
    });

    console.log(info);

    res.render("frontend/otp");
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  loginLoad,
  signupLoad,
  submitSignup,
  otpLoad,
};
