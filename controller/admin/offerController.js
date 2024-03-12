const productHelper = require("../../helpers/productHelper");
const categoryHelper = require("../../helpers/categoryHelper");
const offerHelper = require("../../helpers/offerHelper");
const moment = require("moment");

const offerAddLoad = async (req, res) => {
  try {
    const message = req.query.message;
    const products = await productHelper.activeProductList();
    const categories = await categoryHelper.categoryLoadHelper();

    res.render("backend/offerAdd", {
      products: products,
      categories: categories,
      message: message,
    });
  } catch (error) {
    console.log(error);
  }
};

const offerAdd = async (req, res) => {
  try {
    const data = req.body;
    const offerAdd = await offerHelper.offerAddHelper(data);
    if (offerAdd) {
      res.redirect("/admin/offer-add?message=Offer added");
    }
  } catch (error) {
    console.log(error);
  }
};

const offerList = async (req, res) => {
  try {
    const page = parseInt(req.query.page) || 1;
    const pageSize = 5;
    const offers = await offerHelper.getAllOffer(page, pageSize);
    for (const offer of offers) {
      offer.initialDate = moment(offer.startDate).format("DD-MM-YYYY");
      offer.expiryDate = moment(offer.endDate).format("DD-MM-YYYY");
    }
    res.render("backend/offerList", { offers: offers });
  } catch (error) {
    console.log(error);
  }
};

const offerStatus = async (req, res) => {
  try {
    const offerId = req.params.id;
    const offerStatus = await offerHelper.offerStatusHelper(offerId);
    if (offerStatus) {
      res.json({ status: true });
    }
  } catch (error) {
    console.log(error);
  }
};

const offerEditLoad = async (req, res) => {
  try {
    const offerId = req.params.id;
    const offer = await offerHelper.getSingleOffer(offerId);
    offer.initialDate = moment(offer.startDate).format("YYYY-MM-DD");
    offer.expiryDate = moment(offer.endDate).format("YYYY-MM-DD");
    const message = req.query.message;
    const products = await productHelper.activeProductList();
    const categories = await categoryHelper.categoryLoadHelper();
    res.render("backend/offerEdit", {
      offer: offer,
      message: message,
      products: products,
      categories: categories,
    });
  } catch (error) {
    console.log(error);
  }
};

const offerEdit = async (req, res) => {
  try {
    const offerId = req.params.id;
    const offerEdit = await offerHelper.offerEditHelper(offerId, req.body);
    if (offerEdit) {
      res.redirect(
        `/admin/offer-edit/${offerId}?message=Offer edited successfully`
      );
    }
  } catch (error) {
    console.log(error);
  }
};

const deleteOffer = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await offerHelper.deleteOfferHelper(id);
    res.json({ status: result });
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  offerAddLoad,
  offerAdd,
  offerList,
  offerStatus,
  offerEditLoad,
  offerEdit,
  deleteOffer,
};
