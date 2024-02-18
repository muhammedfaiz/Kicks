const mongoose = require("mongoose");

const offerSchema = new mongoose.Schema({
  name: { type: String, required: true },
  startDate: {
    type: Date,
    required: true,
  },
  endDate: {
    type: Date,
    required: true,
  },
  status: {
    type: Boolean,
    default: true,
  },
  productOffer: {
    product: { type: mongoose.Types.ObjectId, ref: "Product" },
    discount: Number,
  },
  categoryOffer: {
    category: { type: mongoose.Types.ObjectId, ref: "Category" },
    discount: Number,
  },
});

offerSchema.pre("save", function (next) {
  const currentDate = new Date();
  if (currentDate >= this.endDate) {
    this.status = false;
  } else if (currentDate <= this.startDate) {
    this.status = false;
  }
  next();
});

const Offer = mongoose.model("Offer", offerSchema);
module.exports = Offer;
