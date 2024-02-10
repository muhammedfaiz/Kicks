const mongoose = require('mongoose');

const cartSchema = mongoose.Schema({
    user:{
        type:mongoose.Types.ObjectId,
        ref:"User"
    },
    items:[{
        product:{type:mongoose.Types.ObjectId ,ref:'Product'},
        quantity:{type:Number,default:1},
        size:{type:String,default:"M"},
        price:{type:Number}
        
    }],
    total:{
        type:Number, 
    }
});

const Cart = mongoose.model("Cart",cartSchema);
module.exports=Cart;