
// adminDashboard
const dashboardLoad = async (req, res) => {
  try {
    res.render("backend/dashboard");
  } catch (error) {
    console.log(error);
  }
};

module.exports = {
  dashboardLoad
};
