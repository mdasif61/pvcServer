const mongoose = require('mongoose')

const dipositeModels = mongoose.Schema({
    diposite: { type: String, required: true },
    ACamount: {type:String, required:true},
    totalCollected: {type:String,required:true},
    totalExpense: {type:String,required:true},
    date:{
        startDate:{type:String,required:true},
        endDate:{type:String,required:true}
    }
},
{timestamps:true}
)

const Diposite=mongoose.model("Diposite",dipositeModels);
module.exports=Diposite