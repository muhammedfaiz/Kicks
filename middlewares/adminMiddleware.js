const isLogin = (req,res,next)=>{
    if(!req.session.admin){
        res.redirect('/admin');
    }else{
        next();
    }
}

const notLogin = (req,res,next)=>{
    if(req.session.admin){
        res.redirect('/admin/dashboard');
    }else{
        next();
    }
}

module.exports={isLogin,notLogin}