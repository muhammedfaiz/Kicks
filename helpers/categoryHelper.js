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

    const category = await Category.create({
      name: categoryData.categoryName,
      list: categoryData.list,
    });
    if (category) {
      response = category;
      resolve(response);
    }else{
        response="Could not add category";
        reject(response);
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
    const result = await Category.findByIdAndUpdate(id,data);
    if(result){
      resolve('Category has been updated');
    }else{
      reject("Failed to update");
    }
  });
}

const categoryDelete = (id)=>{
  return new Promise(async(resolve,reject)=>{
    let deleteData = await Category.findByIdAndDelete(id);
    if(deleteData){
      resolve("Delete success");
    }else{
      reject("Could not Delete");
    }
  });
}

module.exports = { categoryAddHelper,categoryLoadHelper,categoryEditLoadHelper,categoryEditHelper,categoryDelete };
