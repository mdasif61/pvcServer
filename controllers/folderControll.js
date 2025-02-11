const { Promise } = require("mongoose");
const Folder = require("../models/folderModels");

const folderControll = async (req, res) => {
  const blankFolder = req.body

  const folderData = await Folder.create(blankFolder);
  if (folderData) {
    res.status(201).json({ message: "folder created" })
  }
};

const getFolder = async (req, res) => {
  const allFolder = await Folder.find({});
  if (!allFolder) {
    return res.status(404).json({ message: "folder not found" })
  };
  return res.status(201).json(allFolder)
}

const folderUpdate = async (req, res) => {
  const { id } = req.params;
  const workItem = req.body;

  try {
    const folder = await Folder.findById(id);
    if (!folder) {
      return res.status(404).json({ message: 'Folder not found' });
    }
    folder.work.push(workItem);

    for (const item of folder.work) {
      const size = item.size;
      if (size && typeof size === "string" && (size.includes("*") || size.includes("x") || size.includes("/") || size.includes("-"))) {
        const separator = size.includes("*") ? "*" :
          size.includes("x") ? "x" :
            size.includes("/") ? "/" : "-";

        const [width, height] = size.split(separator).map(Number);
        const Sft = width * height;

        const quantity = Number(item?.quantity);
        const totalSft = Sft * quantity;
        item.sqft = totalSft;
        item.amount = totalSft * Number(item?.rate);
      }
    }

    await folder.save();
    res.status(201).json(folder);
  } catch (error) {
    console.error(error);
    res.status(500).json({ message: 'Internal server error' });
  }
}

const folderCollectedTk = async (req, res) => {
  const { id } = req.params;
  const { folderid } = req.query;
  const { collectedAndduesAmount } = req.body;
  const [collectedTk, dues] = collectedAndduesAmount;

  const singleFolder = await Folder.findById(folderid);
  if (!singleFolder) {
    return res.status(404).json({ message: "folder not found" })
  }
  const workItem = singleFolder.work.find(item => item._id == id);
  if (!workItem) {
    return res.status(404).json({ message: "workitem not found" })
  }

  workItem.collectedTk = Number(collectedTk.collectedTk);
  workItem.dues = Number(dues.dues);
  await singleFolder.save();
  res.status(201).json(singleFolder)
};

const folderRename = async (req, res) => {
  const { id } = req.params;
  const {foldername} = req.query;
  const folder = await Folder.findById(id);
  console.log(folder,foldername)
  folder.name = foldername
  await folder.save()
  res.status(201).json(folder)
}

module.exports = {
  folderControll,
  getFolder,
  folderUpdate,
  folderCollectedTk,
  folderRename
}