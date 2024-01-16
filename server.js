const express = require("express");
const app = express();
const mongoose = require("mongoose");
const session = require("express-session");
const path = require("path");
const user = require("./routes/users");
const bodyParser = require("body-parser");

// mongoose connection establishment
const uri = "mongodb://127.0.0.1:27017/Kicks";
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

// setting view engine
app.set("view engine", "ejs");
// setting public
app.use(express.static(path.join(__dirname, "public")));
// parsing body
app.use(bodyParser.urlencoded({ extended: true }));
app.use(bodyParser.json());
// Setting up session
app.use(session({ secret: "mine", resave: false, saveUninitialized: false,cookie:{
    maxAge:60000,secure:false,httpOnly:true
} }));

// cach-control middleware
app.use((req,res,next)=>{
    res.header('Cache-Control','no-cache,no-store,must-revalidate');
    next();
});

// Routing
app.use("/", user);

// listening app in the port
app.listen("2500", () => {
  try {
    console.log(`Server is running on  http://localhost:2500`);
  } catch (error) {
    console.log("error:", error);
  }
});
