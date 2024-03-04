const userHelper = require("../../helpers/userHelper");
const productHelper = require("../../helpers/productHelper");
const orderHelper = require("../../helpers/orderHelper");
const offerHelper = require("../../helpers/offerHelper");
const moment = require("moment");

// Home serving
const homeLoad = async (req, res) => {
  try {
    let products;
    const userId = req.session.userId;
    if (req.query.search) {
      products = await productHelper.activeProductList(req.query.search);
    } else {
      products = await productHelper.activeProductList();
    }
    const offerProducts = await offerHelper.offerFind(products);

    res.render("frontend/home", {
      products: offerProducts,
      user: userId,
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
      let quantity = 0;
      const orderDate = moment(item.orderedOn).format("MMMM Do,YYYY");
      item.orderedDate = orderDate;
      item.allTotal = productHelper.currencyFormatter(Math.round(item.total));
      for (let i = 0; i < item.items.length; i++) {
        quantity += item.items[i].quantity;
      }
      item.quantity = quantity;
    }
    const wallet = await userHelper.getWallet(user);
    wallet.balancePrice = productHelper.currencyFormatter(wallet.balance);
    for (const detail of wallet.details) {
      detail.formattedDate = moment(detail.date).format("DD-MM-YYYY");
      detail.formatAmount = productHelper.currencyFormatter(detail.amount);
    }

    res.render("frontend/profile", {
      data: data,
      user: user,
      orders: order,
      wallet: wallet,
    });
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
    res.redirect("/user/" + userId);
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
