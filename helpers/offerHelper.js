const { EventEmitterAsyncResource } = require("nodemailer/lib/xoauth2");
const Offer = require("../models/offerModel");
const Product = require("../models/productModel");
const productHelper = require("../helpers/productHelper");

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

const getActiveOffer = (date) => {
  return new Promise(async (resolve, reject) => {
    try {
      const offer = await Offer.find({
        startDate: { $lte: date },
        endDate: { $gte: date },
        status: true,
      })
        .populate("productOffer.product")
        .populate("categoryOffer.category");
      resolve(offer);
    } catch (error) {
      console.log(error);
    }
  });
};

const getproductOffer = (prodId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const offer = await Offer.findOne({
        "productOffer.product": prodId,
        status: true,
      });
      if (offer) {
        resolve(offer.productOffer);
      } else {
        resolve(false);
      }
    } catch (error) {
      console.log(error);
    }
  });
};

const getCategoryOffer = (catId) => {
  return new Promise(async (resolve, reject) => {
    try {
      const offer = await Offer.findOne({
        "categoryOffer.category": catId,
        status: true,
      });
      if (offer) {
        resolve(offer.categoryOffer);
      } else {
        resolve(false);
      }
    } catch (error) {
      console.log(error);
    }
  });
};

const offerFind = (products) => {
  return new Promise(async (resolve, reject) => {
    try {
      const currentDate = new Date();
      const offer = await getActiveOffer(currentDate);
      for (let i = 0; i < products.length; i++) {
        const productOffer = offer.find((item) =>
          item.productOffer.product._id.equals(products[i]._id)
        );
        const categoryOffer = offer.find((item) =>
          item.categoryOffer.category._id.equals(products[i].category._id)
        );
        if (productOffer && categoryOffer) {
          if (
            productOffer.productOffer.discount >
            categoryOffer.categoryOffer.discount
          ) {
            const offerPrice =
              products[i].price -
              (products[i].price * productOffer.productOffer.discount) / 100;
            products[i].offerPrice = productHelper.currencyFormatter(
              Math.round(offerPrice)
            );
          } else {
            const offerPrice =
              products[i].price -
              (products[i].price * categoryOffer.categoryOffer.discount) / 100;
            products[i].offerPrice = productHelper.currencyFormatter(
              Math.round(offerPrice)
            );
          }
        } else if (productOffer) {
          const offerPrice =
            products[i].price -
            (products[i].price * productOffer.productOffer.discount) / 100;
          products[i].offerPrice = productHelper.currencyFormatter(
            Math.round(offerPrice)
          );
        } else if (categoryOffer) {
          const offerPrice =
            products[i].price -
            (products[i].price * categoryOffer.categoryOffer.discount) / 100;
          products[i].offerPrice = productHelper.currencyFormatter(
            Math.round(offerPrice)
          );
        } else {
          const offerPrice =
            products[i].price -
            (products[i].price * products[i].discount) / 100;
          products[i].offerPrice = productHelper.currencyFormatter(
            Math.round(offerPrice)
          );
        }
        products[i].price = productHelper.currencyFormatter(products[i].price);
      }
      resolve(products);
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
  getActiveOffer,
  getproductOffer,
  getCategoryOffer,
  offerFind,
};
