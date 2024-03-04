const Product = require("../models/productModel");
const Category = require("../models/categoryModel");
const ObjectId = require("mongoose").Types.ObjectId;

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
        discount: Number(data.discount),
        stock: [
          {
            size: "S",
            quantity: Number(data.smallQuantity),
          },
          {
            size: "M",
            quantity: Number(data.mediumQuantity),
          },
          {
            size: "L",
            quantity: Number(data.largeQuantity),
          },
        ],
        category: new ObjectId(data.category),
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
    const products = await Product.aggregate([
      {
        $unwind: "$stock",
      },
      {
        $group: {
          _id: "$_id",
          name: { $first: "$name" },
          brandName: { $first: "$brandName" },
          description: { $first: "$description" },
          price: { $first: "$price" },
          discount: { $first: "$discount" },
          status: { $first: "$status" },
          images: { $first: "$images" },
          quantity: { $sum: "$stock.quantity" },
          category: { $first: "$category" },
        },
      },
      {
        $lookup: {
          from: "categories",
          as: "category",
          localField: "category",
          foreignField: "_id",
        },
      },
      {
        $project: {
          _id: 1,
          name: 1,
          brandName: 1,
          description: 1,
          price: 1,
          discount: 1,
          status: 1,
          images: 1,
          quantity: 1,
          category: { $arrayElemAt: ["$category", 0] },
        },
      },
    ]);
    if (products) {
      resolve(products);
    } else {
      reject("No products found");
    }
  });
};

const activeProductList = (search) => {
  return new Promise(async (resolve, reject) => {
    const products = await Product.aggregate([
      {
        $lookup: {
          from: "categories",
          as: "category",
          localField: "category",
          foreignField: "_id",
        },
      },
      {$unwind:"$category"},
      {
        $match: {
          $and: [
            { status: true },
            { "category.list": true },
            {
              $or: [
                { name: { $regex: new RegExp(search, "i") } },
                { "category.name": { $regex: new RegExp(search, "i") } },
              ],
            },
          ],
        },
      },
    ]);
    if (products) {
      resolve(products);
    } else {
      reject("No products found");
    }
  });
};

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
      const exist = await Product.findOne({ name: data.name });
      const existId = "" + exist._id;
      if (!exist) {
        let updateProduct = {
          stock: [],
        };
        if (data.name) {
          updateProduct.name = data.name;
        }
        if (data.brandName) {
          updateProduct.brandName = data.brandName;
        }
        if (data.description) {
          updateProduct.description = data.description;
        }
        if (data.price) {
          updateProduct.price = data.price;
        }
        if (data.discount) {
          updateProduct.offerPrice = data.discount;
        }
        if (data.smallQuantity) {
          updateProduct.stock.push({ size: "S", quantity: data.smallQuantity });
        }
        if (data.mediumQuantity) {
          updateProduct.stock.push({
            size: "M",
            quantity: data.mediumQuantity,
          });
        }
        if (data.largeQuantity) {
          updateProduct.stock.push({ size: "L", quantity: data.largeQuantity });
        }
        if (productImage.length >= 4) {
          updateProduct.images = productImage;
        }
        const updatedProduct = await Product.updateOne(
          { _id: id },
          { $set: updateProduct }
        );
        resolve("Product Edited");
      } else if (exist && existId == id) {
        let updateProduct = {
          stock: [],
        };
        if (data.name) {
          updateProduct.name = data.name;
        }
        if (data.brandName) {
          updateProduct.brandName = data.brandName;
        }
        if (data.description) {
          updateProduct.description = data.description;
        }
        if (data.price) {
          updateProduct.price = data.price;
        }
        if (data.discount) {
          updateProduct.offerPrice = data.discount;
        }
        if (data.smallQuantity) {
          updateProduct.stock.push({ size: "S", quantity: data.smallQuantity });
        }
        if (data.mediumQuantity) {
          updateProduct.stock.push({
            size: "M",
            quantity: data.mediumQuantity,
          });
        }
        if (data.largeQuantity) {
          updateProduct.stock.push({ size: "L", quantity: data.largeQuantity });
        }
        if (productImage.length >= 4) {
          updateProduct.images = productImage;
        }
        const updatedProduct = await Product.updateOne(
          { _id: id },
          { $set: updateProduct }
        );
        resolve("Product Edited");
      } else {
        resolve("Product already exists");
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
      const product = await Product.findById(id).populate("category");
      if ((product._id = id)) {
        resolve(product);
      } else {
        reject("Product not found");
      }
    } catch (error) {
      console.log(error);
    }
  });
};

const currencyFormatter = (amount) => {
  return Number(amount).toLocaleString("en-in", {
    style: "currency",
    currency: "INR",
  });
};

const parseCurrencyString = (formattedString) => {
  // Remove non-numeric characters and convert to a number
  return Number(formattedString.replace(/[^0-9.-]+/g, ""));
};

const shopViewHeleper = (category) => {
  return new Promise(async (resolve, reject) => {
    try {
      if (category) {
        const products = await Product.aggregate([
          {
            $lookup: {
              from: "categories",
              as: "category",
              localField: "category",
              foreignField: "_id",
            },
          },
          {
            $unwind: "$category",
          },
          {
            $match: {
              $and: [
                { status: true },
                { "category.list": true },
                { "category._id": new ObjectId(category) },
              ],
            },
          },
        ]);
        resolve(products);
      }  else {
        const products = await Product.aggregate([
          {
            $lookup: {
              from: "categories",
              as: "category",
              localField: "category",
              foreignField: "_id",
            },
          },
          {
            $unwind: "$category",
          },
          {
            $match: {
              $and: [{ status: true }, { "category.list": true }],
            },
          },
        ]);
        resolve(products);
      }
    } catch (error) {
      console.log(error);
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
  currencyFormatter,
  parseCurrencyString,
  shopViewHeleper,
  
};
