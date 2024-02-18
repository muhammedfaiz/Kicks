const couponHelper = require("../../helpers/couponHelper");
const productHelper = require("../../helpers/productHelper");

const applyCoupon = async (req, res) => {
  try {
    const data = req.body;
    const userId = req.session.userId;
    const applyCode = await couponHelper.applyCouponHelper(data, userId);
    if(applyCode.status){
        const formattedTotal = productHelper.currencyFormatter(
            Math.round(applyCode.cart.total)
          );
          res.json({ ...applyCode ,allTotal:formattedTotal});
    }
    else{
      res.json({...applyCode});
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  applyCoupon,
};
