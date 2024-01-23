const mongoose = require('mongoose');

const categorySchema = mongoose.Schema({
    name: { type: String, required: true },
    list:{type:Boolean,default:true}
});

const Category = mongoose.model('Category',categorySchema);
module.exports=Category;