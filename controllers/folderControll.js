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

const folderUpdate=async(req,res)=>{
    const {id}=req.params;
    const workItem=req.body;

    const folder = await Folder.findById(id);
    const modifiFolder = folder?.work.map(async(item) => {
      const size = item.size;
      if (size && size.includes("*" || "/" || "x" || "-")) {
        const [width, height] = size.split("*" || "/" || "x" || "-").map(Number);
        const Sft = width * height;

        const quantiy = Number(item?.quantity);
        const totalSft = Sft * quantiy;
        // console.log(totalSft);

        try {
          const updateDoc =await Folder.findByIdAndUpdate(id, {
            $set: {
              sqft: totalSft,
              amount:totalSft*Number(item?.rate)
            },
          });
          console.log(updateDoc);
        } catch (error) {} 
      }
    });

    folder.work.push(workItem);
    await folder.save();
    res.status(201).json(folder)
}

module.exports={
    folderControll,
    getFolder,
    folderUpdate
}