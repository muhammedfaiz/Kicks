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
const multer = require('multer');
const path = require('path');
const storage = multer.diskStorage({
    destination:'public/uploads',
    filename:(req,file,cb)=>{
        const uniqueSuffix = ''+Date.now()+Math.floor(Math.random()*1E9);
        const fileName = uniqueSuffix + path.extname(file.originalname);
        cb(null,fileName);
    }
});

const upload = multer({storage:storage});

module.exports={isLogin,notLogin,upload}