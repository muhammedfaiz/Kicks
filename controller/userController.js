const User = require('../models/userModel');
const bcrypt = require('bcrypt');


// password Hashing
const passwordHash= async (password)=>{
    try{
        return bcrypt.hash(password,10);
    }catch(error){
        console.log(error);
    }
}

// load login page
const loginLoad = async (req,res)=>{
    try{
        res.render('frontend/login');
    }catch(error){
        console.log('Error:',error);
    }  
}

// load signup page
const signupLoad = async (req,res)=>{
    try {
        res.render('frontend/register');
    } catch (error) {
        console.log("Error:",error);
    }
}

// submit the signup details
const submitSignup = async (req,res)=>{
   try {
    const {name,email,mobile,password}=await req.body;
    const pass = await passwordHash(password);
    const newUser = await User.create({
        name:name,
        email:email,
        mobile:mobile,
        password:pass
       
    });
    if(newUser.name === name){
        req.session.user_id = newUser._id;
        res.redirect('/otp-verify');
    }
   } catch (error) {
    console.log(error);
   }

}

// otpVerify load
const otpLoad = async (req,res)=>{
    try{
        res.render('frontend/otp');
    }catch(error){
        console.log(error);
    }
}

module.exports={
    loginLoad,signupLoad,submitSignup,otpLoad
}