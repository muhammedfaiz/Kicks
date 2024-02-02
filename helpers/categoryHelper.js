const Category = require("../models/categoryModel");
const mongoose=require("mongoose");

const categoryLoadHelper = () =>{
    return new Promise(async(resolve,reject)=>{
        const category = await Category.find({});
        if(category){
            resolve(category);
        }else{
            reject('No categories found');
        }
    })
}

const categoryAddHelper = (categoryData) => {
  return new Promise(async (resolve, reject) => {
    let response;
    const result = await Category.find({name:categoryData.categoryName});
    if(!result){
      const category = await Category.create({
        name: categoryData.categoryName,
        list: categoryData.list,
      });
      if (category) {
        response='Category Added'
        resolve(response);
      }}else{
        response="Category already exists";
        resolve(response);
    }
    
  });
};


const categoryEditLoadHelper = (id)=>{
  return new Promise(async(resolve,reject)=> {
    try {
      const category = await Category.findById(id);
      if(category){
        resolve(category);
      }else{
        reject("No such category");
      }
    } catch (error) {
      console.log(error);
    }
  });
}

const categoryEditHelper = (id,data)=>{
  return new Promise(async(resolve,reject)=>{
        const exist = await Category.findOne({name:data.categoryName})
    if(!exist){
      const result = await Category.findByIdAndUpdate(id,{
        name:data.categoryName,
        list:data.list
      });
      if(result){
        resolve('Category has been updated');
      }
    }else{
      resolve("Category already exists");
    }
  });
}

const categoryRemoveHelper = (id)=>{
  return new Promise(async(resolve,reject)=>{
    const result = await Category.findById({_id:id});
    result.list=!result.list;
    result.save();
    resolve(result);
  });
}

module.exports = { categoryAddHelper,categoryLoadHelper,categoryEditLoadHelper,categoryEditHelper,categoryRemoveHelper };
