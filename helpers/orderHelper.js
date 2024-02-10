const Order = require("../models/orderModel");
const Cart = require("../models/cartModel");
const User = require("../models/userModel");
const Product = require("../models/productModel");
const ObjectId = require('mongoose').Types.ObjectId;

const placeOrderHelper=(data,userId)=>{
    return new Promise(async(resolve,reject)=>{
        try {
            const cart = await Cart.findOne({user:userId}); 
            const userAddress=await User.findOne({_id:userId,'address._id': data.address },
                { 'address.$': 1,_id:0 }
            );
            const user= await User.findOne({_id:userId});
            let items=[];
            for(let i=0;i<cart.items.length;i++){
                items.push({
                    product:cart.items[i].product,
                    quantity:cart.items[i].quantity,
                    size:cart.items[i].size,
                    price:cart.items[i].price,
                });
                let product= await Product.updateOne({_id:cart.items[i].product,"stock.size":cart.items[i].size},{$inc:{'stock.$.quantity':-(cart.items[i].quantity)}});
            }
            if(cart && userAddress){
                const order = await Order.create({
                    user:new ObjectId(userId),
                    items:items,
                    address:{
                        name:userAddress.address[0].name,
                        house:userAddress.address[0].house,
                        city:userAddress.address[0].city,
                        state:userAddress.address[0].state,
                        country:userAddress.address[0].country,
                        pincode:userAddress.address[0].pincode,
                        mobile:user.mobile,
                    },
                    paymentMethod:data.payment,
                    total:cart.total
                })
                resolve(order);
            }
        } catch (error) {
            console.log(error);
        }
    });
}

const orderUserHelper = (userId)=>{
    return new Promise(async(resolve, reject) => { 
        try {
            const data = await Order.find({user:userId});
            if(data){
                resolve(data);
            }
        } catch (error) {
            console.log(error);
        }
     })
}

const orderDetailsHelper = (orderId)=>{
    return new Promise(async(resolve, reject) => { 
        const order = await Order.findById(orderId).populate('user').populate('items.product');
       resolve(order);
     });
}

const orderCancelHelper = (orderId)=>{
    return new Promise(async(resolve, reject) => { 
        const result = await Order.findByIdAndUpdate(orderId,{status:"Canceled"});
        resolve(result);
     })
}

const getAllOrders=()=>{
    return new Promise(async(resolve, reject) => { 
        const result = await Order.aggregate([{$lookup:{
            "from":"users","localField":"user","foreignField":"_id","as":"user"
        }}]);
        resolve(result);
     })
}

const changeOrderStatusHelper = (orderId,data)=>{
    return new Promise(async(resolve, reject) => { 
        const updateStatus = await Order.findByIdAndUpdate(orderId,data);
        resolve(updateStatus);
     })
}

module.exports={placeOrderHelper,orderUserHelper,orderDetailsHelper,orderCancelHelper,getAllOrders,changeOrderStatusHelper}