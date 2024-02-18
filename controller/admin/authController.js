const adminHelper = require("../../helpers/adminHelper");

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

  // logout
const adminLogout = async (req, res) => {
    try {
      delete req.session.admin;
      res.redirect("/admin");
    } catch (error) {
      console.log(error);
    }
  };

module.exports={loginLoad,loginSubmit,adminLogout};