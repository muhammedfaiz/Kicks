const mongoose = require('mongoose');

const productSchema = mongoose.Schema({
    name:{
        type:String,
        required:true
    },
    brandName:{
        type:String,
        required:true
    },
    description:{
        type:String,
        required:true
    },
    price:{
        type:Number,
        required:true
    },
    offerPrice:{
        type:Number,
        required:true
    },
    size:{
        type:String,
        required:true
    },
    stock:{
        type:Number,
        required:true
    },
    status:{
        type:Boolean,
        default:true
    },
    images:{
        type:Array,
        required:true
    },
    category:{
        type:mongoose.Types.ObjectId,  //referencing the Category model
        ref:"Category"   //the field in Category model that this field is referencing to
    }
});

const Product = mongoose.model('Product',productSchema);
module.exports=Product;