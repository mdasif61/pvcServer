const Diposite = require("../models/dipositeModels");
const Expense = require("../models/expenseModels");
const Folder = require("../models/folderModels");
const products = require("../models/productModels");

const addDiposite=async(req,res)=>{
    const {diposite,ACamount,totalCollected,totalExpense,date}=req.body;
    const newDiposite=new Diposite({
        diposite,
        ACamount,
        totalCollected,
        totalExpense,
        date
    });
    const saveDipositeInDB=await newDiposite.save();
    if(saveDipositeInDB){
        await products.deleteMany({dues:"0"});
        await Expense.deleteMany({})
        await Folder.updateMany(
            {},
            {$pull:{work:{dues:"0"}}}
        )
    }
    return res.status(201).json(saveDipositeInDB)
};

const getDipositeData=async(req,res)=>{
    const allDipositeData=await Diposite.find({}).sort({_id:-1});
    try {
        if(!allDipositeData){
            return res.status(404).json({message:"diposite data not found"})
        }
        return res.status(201).json(allDipositeData)
    } catch (error) {
        return res.status(501).json({messaage:"internal server error"})
    }
}

module.exports={
    addDiposite,
    getDipositeData
}