const User = require('../models/userModel');
const bcrypt = require('bcrypt');

const loginHelper = (userData)=>{
    return new Promise(async(resolve,reject)=>{
        let user = await User.findOne({email:userData.email});
        let response = {}
        if(user){
            if(user.status){
                bcrypt.compare(userData.password,user.password).then((result)=>{
                    if(result){
                        response.user=user;
                        response.isLogin=true;
                        resolve(response);
                    }else{
                        response.error="Invalid Email or password";
                        reject(response);
                    }
                })
    
            }else{
                response.error='User not found';
                reject(response);
            }
        }else{
            response.error='User Not Found';
            reject(response);
        }
        
    });
}

const signupHelper = (userData)=>{
    return new Promise(async(resolve,reject)=>{
        //checking email already exists or not
        let response = {};
        let userEmailExist = await User.findOne({ email: userData.email });
        let userMobileExist = await User.findOne({ mobile: userData.mobile });
        if (!userEmailExist && !userMobileExist) {
            response.isSignUp = true;
            response.user = userData;
            resolve(response);
        }else if(userEmailExist){
            response.error="User email already exists";
            reject(response);
        }else if(userMobileExist){
            response.error="User mobile already exists";
            reject(response);
        }
    });
}




module.exports = {loginHelper,signupHelper}