const User = require("../models/userModel");
const bcrypt = require("bcrypt");
const ObjectId = require("mongoose").Types.ObjectId;
const jwt = require("jsonwebtoken");

const loginHelper = (userData) => {
  return new Promise(async (resolve, reject) => {
    let user = await User.findOne({ email: userData.email });
    let response = {};
    if (user) {
      if (user.status) {
        bcrypt.compare(userData.password, user.password).then((result) => {
          if (result) {
            response.user = user;
            response.isLogin = true;
            resolve(response);
          } else {
            response.error = "Invalid Email or password";
            reject(response);
          }
        });
      } else {
        response.error = "User not found";
        reject(response);
      }
    } else {
      response.error = "User Not Found";
      reject(response);
    }
  });
};

const signupHelper = (userData) => {
  return new Promise(async (resolve, reject) => {
    //checking email already exists or not
    let response = {};
    let userEmailExist = await User.findOne({ email: userData.email });
    let userMobileExist = await User.findOne({ mobile: userData.mobile });
    if (!userEmailExist && !userMobileExist) {
      response.isSignUp = true;
      response.user = userData;
      resolve(response);
    } else if (userEmailExist) {
      response.error = "User email already exists";
      reject(response);
    } else if (userMobileExist) {
      response.error = "User mobile already exists";
      reject(response);
    }
  });
};

const getUserHelper = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await User.findById(id);
      if (user) {
        resolve(user);
      } else {
        resolve(false);
      }
    } catch (error) {
      console.log(error);
    }
  });
};

const addAddressHelper = (id, data) => {
  return new Promise(async (resolve, reject) => {
    const user = await User.updateOne(
      { _id: id },
      {
        $push: {
          address: {
            name: data.name,
            house: data.house,
            city: data.city,
            state: data.state,
            country: data.country,
            pincode: data.pincode,
            type: data.type,
          },
        },
      }
    );
    if (user) {
      resolve(user);
    }
  });
};

const deleteAddressHelper = (userId, addressId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const result = await User.updateOne(
        { _id: userId },
        {
          $pull: {
            address: { _id: addressId },
          },
        }
      );
      if (result) {
        resolve(result);
      }
    } catch (error) {
      console.log(error);
    }
  });
};

const editUserDetailsHelper = (userId, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await User.findById(userId);
      const password = bcrypt.compareSync(data.password, user.password);
      if (password) {
        let userData = {};
        if (data.name) {
          userData.name = data.name;
        }
        if (data.email) {
          userData.email = data.email;
        }
        if (data.mobile) {
          userData.mobile = data.mobile;
        }
        if (data.npassword && data.npassword === data.cpassword) {
          userData.password = bcrypt.hashSync(data.npassword, 10);
        }
        const updataUser = await User.updateOne(
          { _id: userId },
          { $set: userData }
        );
        resolve(updataUser);
      } else {
        resolve("password is incorrect");
      }
    } catch (error) {
      console.log(error);
    }
  });
};

const editAddressLoadHelper = (addressId, userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const address = await User.aggregate([
        { $unwind: "$address" },
        {
          $match: {
            _id: new ObjectId(userId),
            "address._id": new ObjectId(addressId),
          },
        },
        { $project: { address: 1, _id: 0 } },
      ]);
      resolve(address);
    } catch (error) {
      cosnole.log(error);
    }
  });
};

const editAddressHelper = (addressId, userId, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const updateAddress = await User.updateOne(
        { _id: new ObjectId(userId), "address._id": new ObjectId(addressId) },
        {
          $set: {
            "address.$": {
              name: data.name,
              house: data.house,
              city: data.city,
              state: data.state,
              country: data.country,
              pincode: data.pincode,
              type: data.type,
            },
          },
        }
      );
      resolve(updateAddress);
    } catch (error) {
      console.log(error);
    }
  });
};

const getWallet = (userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const result = await User.findOne({ _id: userId }, { _id: 0, wallet: 1 });
      if (result) {
        resolve(result.wallet);
      }
    } catch (error) {
      console.log(error);
    }
  });
};

const getUserEmailHelper = (email) => {
  return new Promise(async (resolve, reject) => {
    try {
      const user = await User.findOne({ email: email });
      if (user) {
        resolve(user);
      } else {
        resolve(false);
      }
    } catch (error) {
      console.log(error);
    }
  });
};

const createWebtoken = (id, email, pass) => {
  return new Promise((resolve, reject) => {
    try {
      const secret = process.env.JWT_SECRET + pass;
      const payload = {
        email: email,
        id: id,
      };
      const token = jwt.sign(payload, secret, { expiresIn: "15m" });
      const link = `http://localhost:2500/reset-password/${id}/${token}`;
      resolve(link);
    } catch (error) {
      console.log(error);
    }
  });
};

const createTokenVerify = (token, pass) => {
  return new Promise(async (resolve, reject) => {
    try {
      const secret = process.env.JWT_SECRET + pass;
      const payload = jwt.verify(token, secret);
      if (payload) {
        resolve(true);
      } else {
        resolve(false);
      }
    } catch (error) {
      console.log(error);
    }
  });
};

const resetPasswordHelper = (id, password) => {
  return new Promise(async (resolve, reject) => {
    try {
      const pass = bcrypt.hashSync(password, 10);
      const update = await User.updateOne(
        { _id: new ObjectId(id) },
        {
          $set: {
            password: pass,
          },
        }
      );
      if (update.acknowledged) {
        resolve(true);
      } else {
        resolve(false);
      }
    } catch (error) {
      console.log(error);
    }
  });
};

module.exports = {
  loginHelper,
  signupHelper,
  getUserHelper,
  addAddressHelper,
  deleteAddressHelper,
  editUserDetailsHelper,
  editAddressLoadHelper,
  editAddressHelper,
  getWallet,
  getUserEmailHelper,
  createWebtoken,
  createTokenVerify,
  resetPasswordHelper,
};
