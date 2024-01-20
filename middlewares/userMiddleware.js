const isLogin = (req,res,next)=>{
    if(!req.session.user_id){
        res.redirect('/login');
    }else{
        next();
    }
}

const notLogin = (req,res,next)=>{
    if(req.session.user_id){
        res.redirect('/');
    }else{
        next();
    }
}

const otpTimeExpiry=(req,res,next)=>{
    if(Date.now() >= req.session.otpExpiration){
        res.redirect("/otp-verify?err=Wrong+OTP");
    }else{
        next();
    }
}




module.exports = {isLogin,otpTimeExpiry,notLogin};