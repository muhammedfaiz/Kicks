const Coupon = require("../models/couponModel");
const Cart = require("../models/cartModel");
const couponAddHelper = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const formattedDate = new Date(data.expiration);
      const addCoupon = await Coupon.create({
        name: data.name,
        code: data.code,
        discount: data.discount,
        expiration: formattedDate,
        status: data.status,
      });
      resolve(addCoupon);
    } catch (error) {
      console.log(error);
    }
  });
};

const couponListHelper = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const list = await Coupon.find();
      resolve(list);
    } catch (error) {
      console.log(error);
    }
  });
};

const getCoupon = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const singleCoupon = await Coupon.findById(id);
      resolve(singleCoupon);
    } catch (error) {
      console.log(error);
    }
  });
};

const couponEditHelper = (id, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const formattedDate = new Date(data.expiration);
      const coupon = {
        name: data.name,
        code: data.code,
        discount: data.discount,
        expiration: formattedDate,
        status: data.status,
      };
      const updateCoupon = await Coupon.findByIdAndUpdate(id, coupon);
      resolve(updateCoupon);
    } catch (error) {
      console.log(error);
    }
  });
};

const toggleStatus = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const coupon = await Coupon.findOne({ _id: id });
      coupon.status = !coupon.status;
      coupon.save();
      resolve("Successfully Toggled Status");
    } catch (error) {
      console.log(error);
    }
  });
};

const applyCouponHelper = (data, userId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const coupon = await Coupon.findOne({ code: data.code });
      if (coupon && coupon.status) {
        if (!coupon.usedBy.includes(userId)) {
          let cart = await Cart.findOne({ user: userId });
          const discount = coupon.discount;
          cart.total = cart.total - (cart.total * discount) / 100;
          cart.coupon = data.code;
          await cart.save();
          resolve({
            discount: discount,
            cart: cart,
            status: true,
            message: "Coupon Applied",
          });
        } else {
          resolve({ message: "Coupon Already used", status: false });
        }
      } else {
        resolve({ message: "Invalid Coupon", status: false });
      }
    } catch (error) {
      console.log(error);
    }
  });
};

const getUserCoupons = async (user) => {
  return new Promise(async (resolve, reject) => {
    try {
      const coupons = await Coupon.find();
      const data=[];
      for(let coupon of coupons){
        if ( coupon.status) {
          if (!coupon.usedBy.includes(user)) {
            data.push(coupon);
          }
        }
      }
      resolve(data);
    } catch (error) {
      console.log(error);
    }
  });
};

module.exports = {
  couponAddHelper,
  couponListHelper,
  getCoupon,
  couponEditHelper,
  toggleStatus,
  applyCouponHelper,
  getUserCoupons,
};
