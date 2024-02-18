const Offer = require("../models/offerModel");

const offerAddHelper = (data) => {
  return new Promise(async (resolve, reject) => {
    try {
      const offer = new Offer({
        name: data.name,
        startDate: data.startDate,
        endDate: data.endDate,
        productOffer: {
          product: data.product,
          discount: data.productDiscount,
        },
        categoryOffer: {
          category: data.category,
          discount: data.categoryDiscount,
        },
      });
      await offer.save();
      resolve(offer);
    } catch (error) {
      console.log(error);
    }
  });
};

const getAllOffer = () => {
  return new Promise(async (resolve, reject) => {
    try {
      const offers = await Offer.find()
        .populate("productOffer.product")
        .populate("categoryOffer.category");
      resolve(offers);
    } catch (error) {
      console.log(error);
    }
  });
};

const offerStatusHelper = (offerId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const offer = await Offer.findById(offerId);
      offer.status = !offer.status;
      await offer.save();
      resolve(offer);
    } catch (error) {
      console.log(error);
    }
  });
};

const getSingleOffer = (offerId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const offer = await Offer.findById(offerId);
      resolve(offer);
    } catch (error) {
      console.log(error);
    }
  });
};

const offerEditHelper = (offerId, data) => {
  return new Promise(async (resolve, reject) => {
    try {
      let offer = await Offer.findOne({ _id: offerId });
      if (data.name) {
        offer.name = data.name;
      }
      if (data.startDate) {
        offer.startDate = data.startDate;
      }
      if (data.endDate) {
        offer.endDate = data.endDate;
      }
      if (data.product) {
        offer.productOffer.product = data.product;
      }
      if (data.productDiscount) {
        offer.productOffer.discount = data.productDiscount;
      }
      if (data.category) {
        offer.categoryOffer.category = data.category;
      }
      if (data.categoryDiscount) {
        offer.categoryOffer.discount = data.categoryDiscount;
      }
      if (data.status) {
        offer.status = data.status;
      }
      await offer.save();
      resolve(offer);
    } catch (error) {
      console.log(error);
    }
  });
};

module.exports = {
  offerAddHelper,
  getAllOffer,
  offerStatusHelper,
  getSingleOffer,
  offerEditHelper,
};
