const userHelper = require("../../helpers/userHelper");
const productHelper = require("../../helpers/productHelper");
const orderHelper = require("../../helpers/orderHelper");
const moment = require("moment");

// Home serving
const homeLoad = async (req, res) => {
  try {
    const products = await productHelper.activeProductList();
    for (let i = 0; i < products.length; i++) {
      const offerPrice =
        products[i].price - (products[i].price * products[i].discount) / 100;
      products[i].offerPrice = productHelper.currencyFormatter(
        Math.round(offerPrice)
      );
      products[i].price = productHelper.currencyFormatter(products[i].price);
    }
    res.render("frontend/home", {
      products: products,
      user: req.session.userId,
    });
  } catch (error) {
    console.log(error);
  }
};

// user profile
const getUserProfile = async (req, res) => {
  try {
    const id = req.params.id;
    const user = req.session.userId;
    const data = await userHelper.getUserHelper(id);
    const order = await orderHelper.orderUserHelper(req.session.userId);
    for (const item of order) {
      let quantity=0;
      const orderDate = moment(item.orderedOn).format("MMMM Do,YYYY");
      item.orderedDate = orderDate;
      item.allTotal = productHelper.currencyFormatter(Math.round(item.total));
      for(let i=0;i<item.items.length;i++){
        quantity += item.items[i].quantity;
      }
      item.quantity = quantity;
    }
    if ((data._id = id && order)) {
      res.render("frontend/profile", { data: data, user: user, orders: order });
    }
  } catch (error) {
    console.log(error);
  }
};
// adds address to user
const addressAdd = async (req, res) => {
  try {
    const id = req.session.userId;
    const result = await userHelper.addAddressHelper(id, req.body);
    if ((result._id = id)) {
      res.json({ status: true });
    } else {
      res.json({ status: false });
    }
  } catch (error) {
    console.log(error);
  }
};
// delete address from user
const addressDelete = async (req, res) => {
  try {
    const id = req.params.id;
    const deleted = await userHelper.deleteAddressHelper(
      req.session.userId,
      id
    );
    if (deleted) {
      res.json({ status: true });
    } else {
      res.json({ status: false });
    }
  } catch (error) {
    console.log(error);
  }
};
// user details edit
const editUserDetails = async (req, res) => {
  try {
    const id = req.session.userId;
    const result = await userHelper.editUserDetailsHelper(id, req.body);
    console.log(result);
    if (result != "password is incorrect") {
      res.json({ status: true });
    } else {
      res.json({ status: false });
    }
  } catch (error) {
    console.log(error);
  }
};

// edit address details load
const editAddressLoad = async (req, res) => {
  try {
    const addressId = req.params.id;
    const userId = req.session.userId;
    const result = await userHelper.editAddressLoadHelper(addressId, userId);
    if (result) {
      res.render("frontend/editAddress", {
        address: result[0].address,
        user: userId,
      });
    }
  } catch (error) {
    console.log(error);
  }
};

const editAddress = async (req, res) => {
  try {
    const addressId = req.params.id;
    const userId = req.session.userId;
    const result = await userHelper.editAddressHelper(
      addressId,
      userId,
      req.body
    );
    res.redirect('/user/'+userId);
  } catch (error) {
    cosnole.log(error);
  }
};

module.exports = {
  homeLoad,
  getUserProfile,
  addressAdd,
  addressDelete,
  editUserDetails,
  editAddressLoad,
  editAddress,
};
