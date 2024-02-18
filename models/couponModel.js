const mongoose = require("mongoose");

const couponSchema = new mongoose.Schema({
  name:{type:String,required:true},
  code: { type: String, unique: true,uppercase:true },
  discount: { type: Number, required: true },
  expiration: { type: Date, required: true },
  usedBy: {type:Array},
  status: { type: Boolean, default: true },
});

// check whether the coupon is active or not
couponSchema.pre('save',function(next){
  const now=new Date();
  if(this.expiration<now){
    this.status=false;
  }else{
    this.status=true;
  }
  next();
});

const Coupon = mongoose.model("Coupon", couponSchema);
module.exports = Coupon;
