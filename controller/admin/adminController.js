const dashboardHelper = require("../../helpers/dashboardHelper");
// adminDashboard
const dashboardLoad = async (req, res) => {
  try {
    const topProducts = await dashboardHelper.topProductHelper();
    const topCategories = await dashboardHelper.topCategoryHelper();
    res.render("backend/dashboard", { topProducts, topCategories });
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  dashboardLoad,
};
