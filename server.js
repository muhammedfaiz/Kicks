const express = require("express");
const app = express();
const config = require('./config');
const session = require("express-session");
const path = require("path");
const user = require("./routes/users");
const admin = require('./routes/admin');
const methodOverride = require("method-override");
require('dotenv').config();

config.mongooseSetup();

// setting view engine
app.set("view engine", "ejs");
// setting public
app.use(express.static(path.join(__dirname, "public")));
// parsing body
app.use(express.urlencoded({ extended: true }));
app.use(express.json());
// Setting up session
app.use(session({ secret: "mine", resave: false, saveUninitialized: false,cookie:{
    maxAge:60*60*1000,secure:false,httpOnly:true
} }));
// method-override
app.use(methodOverride('_method'));

// cach-control middleware
app.use((req,res,next)=>{
    res.header('Cache-Control','no-cache,no-store,must-revalidate');
    next();
});

// Routing
app.use("/", user);
app.use("/admin",admin);
app.get('*',(req,res)=>{
  res.render('frontend/404');
});

// listening app in the port
const port = process.env.PORT || 2500
app.listen(port, () => {
  try {
    console.log(`Server is running on  http://localhost:2500`);
  } catch (error) {
    console.log("error:", error);
  }
});
