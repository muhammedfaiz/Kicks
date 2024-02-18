const cartHelper = require("../../helpers/cartHelper");
const productHelper = require("../../helpers/productHelper");

// get all products form the cart
const getAllCart = async (req, res) => {
  try {
    const result = await cartHelper.getAllItems(req.session.userId);
    if (result !== false) {
      for (let i = 0; i < result.items.length; i++) {
        const offerPrice =
          result.items[i].product.price -
          (result.items[i].product.price * result.items[i].product.discount) /
            100;
        let total = result.items[i].quantity * offerPrice;
        result.items[i].subTotal = productHelper.currencyFormatter(
          Math.round(total)
        );
        result.items[i].offerPrice = productHelper.currencyFormatter(
          Math.round(offerPrice)
        );
      }
      const allTotal = productHelper.currencyFormatter(result.total);
      result.allTotal = allTotal;
      res.render("frontend/cart", { data: result, user: req.session.userId });
    } else {
      res.render("frontend/cart", { user: req.session.userId });
    }
  } catch (error) {
    console.log(error);
  }
};

//update quantity
const updateQuantity = async (req, res) => {
  try {
    let click = req.params.click;
    let id = req.params.id;
    let increaseQuantity;
    if (click === "up") {
      increaseQuantity = 1;
    } else {
      increaseQuantity = -1;
    }
    const update = await cartHelper.updateQuantityHelper(
      increaseQuantity,
      id,
      req.session.userId
    );
    if (update !== "Out of stock") {
      const cart = await cartHelper.getCartItem(id, req.session.userId);
      const offerPrice = Math.round(cart.items.product[0].price - (cart.items.product[0].price*cart.items.product[0].discount)/100);
      cart.items.offerPrice =productHelper.currencyFormatter(offerPrice);
      cart.items.totalPrice = productHelper.currencyFormatter(cart.items.quantity * offerPrice);
      cart.allTotal = productHelper.currencyFormatter(Math.round(cart.total));      
      res.json({ status: true ,cart:cart});
    } else if (update === "Quantity cannot be 0") {
      res.json({ message: update });
    } else {
      res.json({ message: update });
    }
  } catch (error) {
    console.log(error);
  }
};

// delete cart items
const deleteCart = async (req, res) => {
  try {
    const id = req.params.id;
    const deleted = await cartHelper.deleteItemHelper(id, req.session.userId);
    if (deleted) {
      res.json({ status: true });
    } else {
      res.json({ status: false });
    }
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  getAllCart,
  updateQuantity,
  deleteCart,
};
