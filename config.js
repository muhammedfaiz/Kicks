const mongoose = require("mongoose");

module.exports = {
  mongooseSetup: async () => {
    // mongoose connection establishment
    try {
      const uri = process.env.URI;
 
      mongoose.connect(uri);  
  
      mongoose.connection.on("connected", () => {
        console.log("connected to Mongodb");
      });

      mongoose.connection.on("disconnected", () => {
        console.log("Disconnected from MongoDB");
      });
    } catch (error) {
      console.log(error);
    }
  },
};
