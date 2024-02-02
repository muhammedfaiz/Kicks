const adminHelper = require("../helpers/adminHelper");
const categoryHelper = require("../helpers/categoryHelper");
const productHelper = require("../helpers/productHelper");
const Category = require("../models/categoryModel");
const Product = require("../models/productModel");

// Login load
const loginLoad = async (req, res) => {
  try {
    const error = req.query.error;
    res.render("backend/login", { error: error });
  } catch (error) {
    console.log(error);
  }
};

// login submit
const loginSubmit = async (req, res) => {
  try {
    const result = await adminHelper.adminGetter(req.body);
    if (result.isLogin) {
      req.session.admin = result.admin._id;
      res.redirect("/admin/dashboard");
    }
  } catch (error) {
    console.log(error);
    res.redirect(`/admin?error=${error.error}`);
  }
};

// adminDashboard
const dashboardLoad = async (req, res) => {
  try {
    res.render("backend/dashboard");
  } catch (error) {
    console.log(error);
  }
};

// logout
const adminLogout = async (req, res) => {
  try {
    delete req.session.admin;
    res.redirect("/admin");
  } catch (error) {
    console.log(error);
  }
};

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
      error:true
    });
  }
};

// categoryList
const categoryList = async (req, res) => {
  try {
    const result = await categoryHelper.categoryLoadHelper();
    if (result) {
      res.render("backend/categoryList", { categories: result });
    }
  } catch (error) {
    console.log(error);
  }
};

// categoryAdd Page
const categoryAddLoad = async (req, res) => {
  try {
    const data = req.query.success;
    res.render("backend/categoryAdd", { data: data });
  } catch (error) {
    console.log(error);
  }
};

// category added
const categoryAdd = async (req, res) => {
  try {
    const result =await categoryHelper.categoryAddHelper(req.body);
    if (result) {
      res.redirect(`/admin/category-add?success=${result}`);
    }
  } catch (error) {
    console.log(error);
    
  }
};

// category-edit load
const categoryEditLoad = async (req, res) => {
  try {
    const data = req.query.success;
    const result = await categoryHelper.categoryEditLoadHelper(req.params.id);
    res.render("backend/categoryEdit", { data: data, category: result });
  } catch (error) {
    console.log(error);
  }
};

// category-edit
const categoryEdit = async (req, res) => {
  const categoryId = req.params.id;
  try {
    const result = await categoryHelper.categoryEditHelper(
      categoryId,
      req.body
    );
    res.redirect(`/admin/category-edit/${categoryId}?success=${result}`);
  } catch (error) {
    console.log(error);
  }
};

// category remove for the list
const categoryRemove = async (req, res) => {
  try {
    let id = req.params.id;
    let text;
    const result = await categoryHelper.categoryRemoveHelper(id);
    if (result.list === true) {
      text = "Active";
    } else {
      text = "Disabled";
    }
    res.json({ newStatus: text });
  } catch (error) {
    console.log(error);
  }
};

// user-list
const userList = async (req, res) => {
  try {
    const result = await adminHelper.userListHelper();
    res.render("backend/userList", { users: result });
  } catch (error) {
    console.log(error);
  }
};

const userStatus = async(req,res)=>{
  try {
    let id = req.params.id;
    let text;
    const result = await adminHelper.userStatusHelper(id);
    if (result.status === true) {
      text = "Active";
    } else {
      text = "Disabled";
      delete req.session.userId;
    }
    res.json({ status: text });
  } catch (error) {
    console.log(error);
  }
}

module.exports = {
  loginLoad,
  loginSubmit,
  dashboardLoad,
  adminLogout,
  productList,
  productAddLoad,
  productAdd,
  productStatusHandle,
  productEditHandler,
  productEdit,
  productDeletion,
  categoryList,
  categoryAddLoad,
  categoryAdd,
  categoryEditLoad,
  categoryEdit,
  categoryRemove,
  userList,
  userStatus,
};
