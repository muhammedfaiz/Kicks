const adminHelper = require("../helpers/adminHelper");
const categoryHelper = require("../helpers/categoryHelper");
const productHelper = require('../helpers/productHelper');

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
    req.session.destroy();
    res.redirect("/admin");
  } catch (error) {
    console.log(error);
  }
};

// productlist
const productList = async (req, res) => {
  try {
    const products = await productHelper.productListHelper();
    res.render("backend/productList",{products:products});
  } catch (error) {
    console.log(error);
  }
};

// productAdd page
const productAddLoad = async (req, res) => {
  try {
    const data = req.query.success;
    const categories = await productHelper.productCategoryList();
    res.render("backend/productAdd",{data:data,categories:categories});
  } catch (error) {
    console.log(error);
  }
};

// product Add
const productAdd=async(req,res)=>{
    try {
        const result =await productHelper.productAddHelper(req.body,req.files);
        res.redirect(`/admin/product-add?success=${result}`);
    } catch (error) {
        console.log(error);
    }
}


// categoryList
const categoryList = async (req,res)=>{
    try {
        const result = await categoryHelper.categoryLoadHelper();
        if(result){
            res.render('backend/categoryList',{categories:result});
        } 
    } catch (error) {
        console.log(error);
    }
}

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
    const result = categoryHelper.categoryAddHelper(req.body);
    if (result) {
      res.redirect("/admin/category-add?success=category added");
    }
  } catch (error) {
    console.log(error);
    res.redirect(`/admin/category-add?success=${error}`);
  }
};

// category-edit load
const categoryEditLoad = async (req,res)=>{
    try {
        const data = req.query.success;
        const result = await categoryHelper.categoryEditLoadHelper(req.params.id);
        res.render('backend/categoryEdit',{data:data,category:result});
    } catch (error) {
        console.log(error);
    }
}

// category-edit
const categoryEdit = async(req,res)=>{
    const categoryId=req.params.id;
    try {
        const result = await categoryHelper.categoryEditHelper(categoryId,req.body);
        res.redirect(`/admin/category-edit/${categoryId}?success=${result}`);
    } catch (error) {
        console.log(error);
    }
}

const categoryDelete = async(req,res)=>{
    const id=req.params.id;
    const result = categoryHelper.categoryDelete(id);
    if(result){
        res.redirect("/admin/category-list");
    }
}

// user-list
const userList = async (req, res) => {
    try {
        const result = await adminHelper.userListHelper()
        res.render("backend/userList",{users:result});
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
  categoryList,
  categoryAddLoad,
  categoryAdd,
  categoryEditLoad,
  categoryEdit,
  categoryDelete,
  userList
};
