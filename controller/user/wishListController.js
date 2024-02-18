const wishListHelper = require("../../helpers/wishListHelper");
const productHelper = require("../../helpers/productHelper");
const cartHelper = require("../../helpers/cartHelper");

const wishListAdd = async (req, res) => {
  try {
    let prodId = req.params.id;
    let userId = req.session.userId;
    const result = await wishListHelper.wishListAddHelper(prodId, userId);
    if (result) {
      res.json({ status: true });
    }
  } catch (error) {
    console.log(error);
  }
};

const removeWishList = async (req, res) => {
  try {
    const prodId = req.params.id;
    const removed = await wishListHelper.removeProductHelper(
      prodId,
      req.session.userId
    );
    if (removed) {
      res.json({ status: true });
    }
  } catch (error) {
    console.log(error);
  }
};

const wishListView = async (req, res) => {
  try {
    const userId = req.session.userId;
    const wishList = await wishListHelper.getAllItemsHelper(userId);
    for (item of wishList.items) {
      item.price = productHelper.currencyFormatter(item.product.price);
      item.quantity =
        item.product.stock[0].quantity +
        item.product.stock[1].quantity +
        item.product.stock[2].quantity; // get quantity from the first stock object in array
        const cart = await cartHelper.cartCheck(item.product._id,userId);
        item.inCart = cart;
    }
    if (wishList) {
      res.render("frontend/wishList", { wishlist: wishList, user: userId });
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  wishListAdd,
  removeWishList,
  wishListView,
};
