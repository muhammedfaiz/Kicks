const productHelper = require("../../helpers/productHelper");
const Product = require("../../models/productModel");
const Category = require("../../models/categoryModel");
// productlist
const productList = async (req, res) => {
  try {
    const products = await productHelper.productListHelper();
    res.render("backend/productList", { products: products });
  } catch (error) {
    console.log(error);
  }
};

// productAdd page
const productAddLoad = async (req, res) => {
  try {
    const data = req.query.success;
    const categories = await productHelper.productCategoryList();
    res.render("backend/productAdd", { data: data, categories: categories });
  } catch (error) {
    console.log(error);
  }
};

// product Add
const productAdd = async (req, res) => {
  try {
    const result = await productHelper.productAddHelper(req.body, req.files);
    res.redirect(`/admin/product-add?success=${result}`);
  } catch (error) {
    console.log(error);
  }
};

// product status Handle
const productStatusHandle = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await productHelper.productStatusHelper(id);
    if (result.status === true) {
      text = "Active";
    } else {
      text = "Disabled";
    }
    res.json({ newStatus: text });
  } catch (error) {
    console.log(error);
  }
};

// product editing handler
const productEditHandler = async (req, res) => {
  try {
    const result = await Product.findById(req.params.id);
    const categories = await Category.find({});
    res.render("backend/productEdit", {
      product: result,
      categories: categories,
      data: req.query.success,
    });
  } catch (error) {
    console.log(error);
  }
};

// product edit
const productEdit = async (req, res) => {
  try {
    const id = req.params.id;
    const data = req.body;
    const files = req.files;
    const result = await productHelper.productEditHelper(id, data, files);
    res.redirect(`/admin/product-edit/${id}?success=${result}`);
  } catch (error) {
    console.log(error);
  }
};

// product delete
const productDeletion = async (req, res) => {
  try {
    const id = req.params.id;
    const result = await productHelper.productDeleteHelper(id);
    res.json({
      success: true,
    });
  } catch (error) {
    console.log(error);
    res.json({
      error: true,
    });
  }
};

module.exports = {
  productList,
  productAddLoad,
  productAdd,
  productStatusHandle,
  productEditHandler,
  productEdit,
  productDeletion,
};
