const Folder = require("../models/folderModels");

const folderControll=async(req,res)=>{
   const blankFolder=req.body

    const folderData=await Folder.create(blankFolder);
    if(folderData){
        res.status(201).json({message:"folder created"})
    }
};

const getFolder=async(req,res)=>{
    const allFolder=await Folder.find({});
    if(!allFolder){
        return res.status(404).json({message:"folder not found"})
    };
    return res.status(201).json(allFolder)
}

module.exports={
    folderControll,
    getFolder
}