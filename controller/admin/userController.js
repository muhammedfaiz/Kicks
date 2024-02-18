const adminHelper = require('../../helpers/adminHelper');
// user-list
const userList = async (req, res) => {
    try {
      const result = await adminHelper.userListHelper();
      res.render("backend/userList", { users: result });
    } catch (error) {
      console.log(error);
    }
  };
  
  const userStatus = async (req, res) => {
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
  };

  module.exports={
    userList,
    userStatus,
  }