const mongoose = require("mongoose");

module.exports = {
  mongooseSetup: () => {
    // mongoose connection establishment
    const uri = process.env.URI;
    mongoose.connect(uri);

    const db = mongoose.connection;

    db.on("connected", () => {
      console.log("connected to Mongodb");
    });

    db.on("error", (err) => {
      console.error("Error connecting to MongoDB:", err);
    });

    db.on("disconnected", () => {
      console.log("Disconnected from MongoDB");
    });
  },
};
