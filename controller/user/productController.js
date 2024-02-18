const productHelper = require("../../helpers/productHelper");
const cartHelper = require("../../helpers/cartHelper");
const wishListHelper = require('../../helpers/wishListHelper');

// product_view
const productView = async (req, res) => {
    try {
      let id = req.params.id;
      const product = await productHelper.selectedProduct(id);
      const offerPrice = product.price - (product.price * product.discount) / 100;
      product.offerPrice = productHelper.currencyFormatter(
        Math.round(offerPrice)
      );
      product.originalPrice = productHelper.currencyFormatter(product.price);
      const cart = await cartHelper.cartCheck(id, req.session.userId);
      const wishList = await wishListHelper.checkWishList(id,req.session.userId);
      res.render("frontend/product-view", {
        product: product,
        status: cart,
        list: wishList,
        user: req.session.userId,
      });
    } catch (error) {
      console.log(error);
    }
  };
  
  // product added to cart
  const addToCart = async (req, res) => {
    try {
      let id = req.params.id;
      let size = req.params.size;
      const result = await cartHelper.addToCartHelper(
        id,
        req.session.userId,
        size
      );
      if (result) {
        res.json({ status: true });
      } else {
        res.json({ status: false });
      }
    } catch (error) {
      console.log(error);
    }
  };

  module.exports={
    productView,
    addToCart,
  }