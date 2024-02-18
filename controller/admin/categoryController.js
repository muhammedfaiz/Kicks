const categoryHelper = require("../../helpers/categoryHelper");

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
    const result = await categoryHelper.categoryAddHelper(req.body);
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

module.exports = {
  categoryList,
  categoryAddLoad,
  categoryAdd,
  categoryEditLoad,
  categoryEdit,
  categoryRemove,
};
