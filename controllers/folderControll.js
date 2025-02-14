const Folder = require("../models/folderModels");

const folderControll = async (req, res) => {
  try {
    const folders = req.body;

    if (!Array.isArray(folders) || folders.length === 0) {
      return res.status(400).json({ message: "Invalid folder data" });
    }

    for (const folderData of folders) {
      const { name, parent } = folderData;
      if (!name) {
        return res.status(400).json({ message: "Folder name is required" });
      }

      if (parent) {
        const parentFolder = await Folder.findById(parent);
        if (!parentFolder) {
          return res.status(404).json({ message: "Parent folder not found" });
        }

        const subfolder = {
          name,
          type: "folder",
          children: [],
          work: [],
        };

        parentFolder.children.push(subfolder);
        await parentFolder.save();

        return res.status(201).json({ message: "Subfolder created", parent: parentFolder });
      } else {
        const newFolder = new Folder({
          name,
          type: "folder",
          children: [],
          work: [],
          parent: null,
        });

        const savedFolder = await newFolder.save();
        return res.status(201).json({ message: "Root folder created", folder: savedFolder });
      }
    }
  } catch (error) {
    console.error("Error creating folders:", error);
    res.status(500).json({ message: "Error creating folders", error });
  }
};

const getFolder = async (req, res) => {
  const allFolder = await Folder.find({ parent: null })
    .populate({
      path: "children",
      populate: { path: "children" }
    });
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
  const { foldername } = req.query;
  const folder = await Folder.findById(id);
  console.log(folder, foldername)
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