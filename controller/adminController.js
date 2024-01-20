const Admin = require('../models/adminModel');
const bcrypt = require('bcrypt');
const Category = require('../models/categoryModel');

async function addAdmin(){
    const pass = 'admin@123'
    const admin = await Admin.create({
        name:"Admin",
        email: "admin@gmail.com",
        password:await bcrypt.hashSync(pass,10)
    });
    console.log(`admin has created: ${admin}`);
}

// Login load
const loginLoad = async (req,res)=>{
    try {
        const error = req.query.error;
        res.render('backend/login',{error:error});
    } catch (error) {
        console.log(error);
    }
}

// login submit
const loginSubmit = async (req,res)=>{
    try {
        let {email,password}=req.body;
        const admin = await Admin.findOne({email:email});
        if(admin){
            const passCompare= bcrypt.compareSync(password,admin.password);
            if(passCompare){
                req.session.admin=admin._id;
                res.redirect('/admin/dashboard');
            }
        }else{
            res.redirect('/admin/login?error=Invalid user email or password');
        }
    } catch (error) {
        console.log(error);
    }
}

// adminDashboard
const dashboardLoad = async (req,res)=>{
    try{
        res.render('backend/dashboard');
    }catch(error){
        console.log(error);
    }
}

// logout
const adminLogout=async (req,res)=> {
    try {
        req.session.destroy();
        res.redirect('/admin');
    } catch (error) {
        console.log(error);
    }
}

// productlist
const productList = async (req,res)=>{
    try{
        res.render('backend/productList');
    }catch(error){
        console.log(error);
    }
} 

// productAdd page
const productAddLoad = async (req,res)=>{
    try {
        res.render('backend/productAdd');
    } catch (error) {
        console.log(error);
    }
}

// categoryAdd Page
const categoryAddLoad = async(req,res)=>{
    try{
        const data = req.query.success;
        res.render('backend/categoryAdd',{data:data});
    }catch(error){
        console.log(error);
    }
}

const categoryAdd =async(req,res)=>{
    try {
        const {categoryName,list}=req.body;
        const category = await Category.create({
            name:categoryName,
            list:list
        });
        res.redirect('/admin/category-add?success=category added');
        console.log(category);
    } catch (error) {
        console.log(error);
    }
}
module.exports = {loginLoad,loginSubmit,dashboardLoad,adminLogout,productList,productAddLoad,categoryAddLoad,categoryAdd};