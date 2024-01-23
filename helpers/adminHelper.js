const Admin = require("../models/adminModel");
const User = require("../models/userModel");
const bcrypt = require("bcrypt");

const adminGetter = (adminData) => {
  return new Promise(async(resolve, reject) => {
    let response = {};
    const admin = await Admin.findOne({ email: adminData.email });
    if (admin) {
      bcrypt.compare(adminData.password, admin.password).then((result) => {
        if (result) {
          response.admin = admin;
          response.isLogin = true;
          resolve(response);
        } 
      }).catch((error)=>{
        console.log(error);
        response.error = "Invalid Email or password";
        reject(response);
      });
    } else {
      response.error = "Admin not found";
      reject(response);
    }
  });
};

const userListHelper = ()=>{
  return new Promise (async(resolve,reject)=>{
    const user = await User.find({});
    if(user){
      resolve(user);
    }else{
      reject('No users in the database');
    }
  });
}

module.exports = {adminGetter,userListHelper};
