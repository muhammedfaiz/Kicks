const Product = require("../models/productModel");
const Category = require("../models/categoryModel");
const { default: mongoose } = require("mongoose");

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

      let newProduct = await Product.create({
        name: data.name,
        brandName: data.brandName,
        description: data.description,
        price: Number(data.price),
        offerPrice: Number(data.offerPrice),
        size: data.size,
        stock: Number(data.stock),
        category: new mongoose.Types.ObjectId(data.category),
        images: productImage,
      });
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

const productListHelper = () => {
  return new Promise(async (resolve, reject) => {
    const products = await Product.find().populate("category");
    if (products) {
      resolve(products);
    } else {
      reject("No products found");
    }
  });
};

const activeProductList = ()=>{
  return new Promise(async (resolve, reject) => {
    const products = await Product.find().populate("category");
    var actProd=products.map((item)=>{
      if(item.category && item.category.list){
        if(item.status){
          return item;
        }
      }
      return null;
    }).filter(Boolean);
    if (actProd) {
      resolve(actProd);
    } else {
      reject("No products found");
    }
  });
}

const productStatusHelper = (id) => {
  return new Promise(async (resolve, reject) => {
    const result = await Product.findById({ _id: id });
    if (result) {
      result.status = !result.status;
      result.save();
      resolve(result);
    } else {
      reject("Product status not changebale");
    }
  });
};

const productEditHelper = (id, data, files) => {
  return new Promise(async (resolve, reject) => {
    try {
      const productImage = [];
      for (let file of files) {
        productImage.push({
          data: file.filename,
          contentType: file.mimetype,
        });
      }
      const exist = await Product.findOne({name:data.name});
      if(!exist){
        const updateProduct = await Product.findByIdAndUpdate(
          id,
          {
            name: data.name,
            brandName: data.brandName,
            description: data.description,
            price: Number(data.price),
            offerPrice: Number(data.offerPrice),
            size: data.size,
            color: data.color,
            stock: Number(data.stock),
            category: new mongoose.Types.ObjectId(data.category),
            images: productImage,
          },
          { new: true }
        );
        if (updateProduct) {
          resolve("Product Edited");
        }
      }
    } catch (error) {
      reject(error);
    }
  });
};

const productDeleteHelper = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const deleteProduct = await Product.deleteOne({ _id: id });
      resolve(deleteProduct);
    } catch (error) {
      reject(error);
    }
  });
};

const selectedProduct = (id) => {
  return new Promise(async (resolve, reject) => {
    try {
      const product = await Product.findById(id).populate('category');
      if ((product._id = id)) {
        resolve(product);
      } else {
        reject("Product not found");
      }
    } catch (error) {
      console.log (error);
    }
  });
};

module.exports = {
  productAddHelper,
  productCategoryList,
  productListHelper,
  productStatusHelper,
  productEditHelper,
  productDeleteHelper,
  selectedProduct,
  activeProductList,
};
