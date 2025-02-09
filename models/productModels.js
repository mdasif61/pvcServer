const mongoose=require('mongoose');

const productModels=mongoose.Schema({
    name:{type:String, required:true},
    size:{type:String,required:true},
    quantity:{type:String,required:true},
    rate:{type:String,required:true},
    sqft:{type:String},
    amount:{type:String},
    total:{type:String},
    collectedTk:{type:String},
    dues:{type:String}
},
{timestamps:true}
);

const products=mongoose.model("products", productModels);
module.exports=products;