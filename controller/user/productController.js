const productHelper = require("../../helpers/productHelper");
const cartHelper = require("../../helpers/cartHelper");
const wishListHelper = require("../../helpers/wishListHelper");
const offerHelper = require("../../helpers/offerHelper");
const categoryHelper = require("../../helpers/categoryHelper");

// product_view
const productView = async (req, res) => {
  try {
    let id = req.params.id;
    const product = await productHelper.selectedProduct(id);
    const productOffer = await offerHelper.getproductOffer(id);
    const categoryOffer = await offerHelper.getCategoryOffer(
      product.category._id
    );
    if (productOffer && categoryOffer) {
      if (productOffer.discount > categoryOffer.discount) {
        const offerPrice =
          product.price - (product.price * productOffer.discount) / 100;
        product.offerPrice = productHelper.currencyFormatter(
          Math.round(offerPrice)
        );
        product.offer = productOffer.discount;
      } else {
        const offerPrice =
          product.price - (product.price * categoryOffer.discount) / 100;
        product.offerPrice = productHelper.currencyFormatter(
          Math.round(offerPrice)
        );
        product.offer = categoryOffer.discount;
      }
    } else {
      if (productOffer) {
        const offerPrice =
          product.price - (product.price * productOffer.discount) / 100;
        product.offerPrice = productHelper.currencyFormatter(
          Math.round(offerPrice)
        );
        product.offer = productOffer.discount;
      } else if (categoryOffer) {
        const offerPrice =
          product.price - (product.price * categoryOffer.discount) / 100;
        product.offerPrice = productHelper.currencyFormatter(
          Math.round(offerPrice)
        );
        product.offer = categoryOffer.discount;
      } else {
        const offerPrice =
          product.price - (product.price * product.discount) / 100;
        product.offerPrice = productHelper.currencyFormatter(
          Math.round(offerPrice)
        );
        product.offer = product.discount;
      }
    }
    product.originalPrice = productHelper.currencyFormatter(product.price);
    const cart = await cartHelper.cartCheck(id, req.session.userId);
    const wishList = await wishListHelper.checkWishList(id, req.session.userId);
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
    let id = req.body.id;
    let size = req.body.size;
    let discount = req.body.discount;
    const result = await cartHelper.addToCartHelper(
      id,
      req.session.userId,
      size,
      discount
    );
    if (result !== "product is not in stock") {
      res.json({ success: true });
    } else {
      res.json({ message: result });
    }
  } catch (error) {
    console.log(error);
  }
};

const shopView = async (req, res) => {
  try {
    const userId = req.session.userId;
    const category = req.query.category;
    const minPrice = req.query.minPrice;
    const maxPrice = req.query.maxPrice;
    const currentDate = new Date();
    let count = 0;
    if (category && !minPrice && !maxPrice) {
      const products = await productHelper.shopViewHeleper(category);
      const categories = await categoryHelper.getActiveCategory();
      const offerProducts = await offerHelper.offerFind(products);
      let count = 0;
      for (const product of offerProducts) {
        count++;
      }
      res.render("frontend/shop", {
        products: offerProducts,
        user: userId,
        count,
        categories,
      });
    } else if (category && minPrice && maxPrice) {
      const productData = await productHelper.shopViewHeleper(category);
      const categories = await categoryHelper.getActiveCategory();
      const offerProducts = await offerHelper.offerFind(productData);
      let products = [];
      for (const product of offerProducts) {
        if (
          productHelper.parseCurrencyString(product.offerPrice) >=
            Number(minPrice) &&
          productHelper.parseCurrencyString(product.offerPrice) <=
            Number(maxPrice)
        ) {
          products.push(product);
        }
        count++;
      }
      res.render("frontend/shop", {
        products,
        user: userId,
        count,
        categories,
      });
    } else if (minPrice && maxPrice && !category) {
      const productData = await productHelper.shopViewHeleper();
      const categories = await categoryHelper.getActiveCategory();
      const offerProducts = await offerHelper.offerFind(productData);
      let products = [];
      for (const product of offerProducts) {
        if (
          productHelper.parseCurrencyString(product.offerPrice) >=
            Number(minPrice) &&
          productHelper.parseCurrencyString(product.offerPrice) <=
            Number(maxPrice)
        ) {
          products.push(product);
        }
        count++;
      }
      res.render("frontend/shop", {
        products,
        user: userId,
        count,
        categories,
      });
    } else {
      const products = await productHelper.shopViewHeleper();
      const categories = await categoryHelper.getActiveCategory();
      const offerProducts = await offerHelper.offerFind(products);
      console.log(offerProducts);
      for (const product of offerProducts) {
        count++;
      }
      res.render("frontend/shop", {
        products: offerProducts,
        user: userId,
        count,
        categories,
      });
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  productView,
  addToCart,
  shopView,
};
