const nodeMailer = require("nodemailer");
const bcrypt = require("bcrypt");
const User = require("../models/userModel");

const otpSender = (email, error) => {
  return new Promise(async (resolve, reject) => {
    let otp = "";
    if (!error) {
      for (let i = 0; i < 6; i++) {
        otp += Math.floor(Math.random() * 10);
      }
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
        to: email,
        subject: "Otp verification",
        text: otp,
      });
      if (info.accepted) {
        resolve(otp);
      }
    } else {
      reject(error);
    }
  });
};

const otpGetter = async (sessionOtp, enteredOtp, user) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (sessionOtp === enteredOtp) {
        const newUser = await User.create({
          name: user.name,
          email: user.email,
          password: bcrypt.hashSync(user.password, 10),
          mobile: user.mobile,
        });
        resolve(newUser);
      } else {
        resolve("Invalid OTP");
      }
    } catch (error) {
      reject(error);
    }
  });
};

const sendResetLink = (link, email) => {
  return new Promise(async (resolve, reject) => {
    try {
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
      const info = transporter.sendMail({
        from: {
          name: "Kicks",
          address: process.env.USER,
        },
        to: email,
        subject: "Reset Password",
        text: `Please click on the following link to reset your password:\n\n ${link} \n\n`,
      });
      if (info) {
        resolve(link);
      } else {
        resolve(false);
      }
    } catch (error) {
      console.log(error);
    }
  });
};



module.exports = {
  otpSender,
  otpGetter,
  sendResetLink,
};
