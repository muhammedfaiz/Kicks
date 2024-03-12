const couponHelper = require("../../helpers/couponHelper");
const moment = require("moment");

const couponAddLoad = (req, res) => {
  try {
    const message = req.query.message;
    res.render("backend/couponAdd", { message: message });
  } catch (error) {
    console.log(error);
  }
};

const couponAdd = async (req, res) => {
  try {
    const result = await couponHelper.couponAddHelper(req.body);
    if (result) {
      res.redirect("/admin/coupon-add?message=Coupon added");
    }
  } catch (error) {
    console.log(error);
  }
};

const couponList = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = 5;
    const coupons = await couponHelper.couponListHelper(page,pageSize);
    for (const coupon of coupons) {
      coupon.expiry = moment(coupon.expiration).format("DD-MMM-YYYY");
    }
    if (coupons) {
      res.render("backend/couponList", { coupons: coupons });
    }
  } catch (error) {
    console.log(error);
  }
};

const couponEditLoad = async (req, res) => {
  try {
    const id = req.params.id;
    const message = req.query.message;
    const coupon = await couponHelper.getCoupon(id);
    const formattedDate = moment(coupon.expiration).format("YYYY-MM-DD");
    coupon.expiry = formattedDate;
    res.render("backend/couponEdit", { coupon: coupon, message: message });
  } catch (error) {
    console.log(error);
  }
};

const couponEdit = async(req,res)=>{
    try {
        const id = req.params.id;
        const couponEdit = await couponHelper.couponEditHelper(id,req.body);
        if(couponEdit){
            res.redirect(`/admin/coupon-edit/${id}?message=Coupon updated`);
        }
    } catch (error) {
        console.log(error);
    }
}

const changeCouponStatus=async(req,res)=>{
    try {
        const id = req.params.id;
        const changeStatus = await couponHelper.toggleStatus(id);
        if(changeStatus){
            res.json({status:true});
        }
    } catch (error) {
        console.log(error);
    }
}

const couponDelete = async(req,res)=>{
  try {
    const id = req.params.id;
    const result = await couponHelper.deleteCoupon(id);
    res.json({status:result});
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  couponAddLoad,
  couponAdd,
  couponList,
  couponEditLoad,
  couponEdit,
  changeCouponStatus,
  couponDelete
};
