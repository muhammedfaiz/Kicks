const Product = require("../models/productModel");
const Category = require("../models/categoryModel");

const productAddHelper = (data, files) => {
  return new Promise(async (resolve, reject) => {
    try {
      const productImage = [];
      for (let file of files) {
        productImage.push({
          data: file.filename,
          contentType: file.mimetype,
        });
      }
      let category = await Category.findOne({name:data.category},{_id:1});
      
      let newProduct = await Product.create({ 
        name:data.name,
        brandName:data.brandName,
        description:data.description,
        price:Number(data.price),
        offerPrice:Number(data.price),
        size:data.size,
        color:data.color,
        stock:Number(data.stock),
        category:category._id,
        images : productImage });
      resolve("New product added successfully");
    } catch (error) {
      console.log(error);
      reject(`Error adding the product ${error}`);
    }
  });
};

const productCategoryList = () => {
  return new Promise(async (resolve, reject) => {
    const categories = await Category.find({ list: true });
    resolve(categories);
  });
};

const productListHelper =()=>{
    return new Promise(async(resolve,reject)=>{
        const products=await Product.find().populate('category');
        console.log(products)
        if(products){
            resolve(products);
        }else{
            reject('No products found');
        }
    });
}

module.exports = { productAddHelper, productCategoryList ,productListHelper};
