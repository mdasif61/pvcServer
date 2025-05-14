const Folder = require("../models/folderModels");

const folderControll = async (req, res) => {
  const folders = req.body;
  try {
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

        const subfolder = new Folder({
          name,
          type: "folder",
          children: [],
          work: [],
          parent: parentFolder._id,
        });

        const savedSubfolder = await subfolder.save();

        parentFolder.children.push(savedSubfolder._id);
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
  try {
    const allFolders = await Folder.find({}).populate('work');

    const rootFolders = allFolders.filter((folder) => folder.parent === null);
    const subfolders = allFolders.filter((folder) => folder.parent !== null);

    const populateChildren = async (folder) => {
      if (folder.children && folder.children.length > 0) {
        folder.children = await Folder.find({ _id: { $in: folder.children } }).populate('work')
          .sort({ createdAt: -1 });
        for (const child of folder.children) {
          await populateChildren(child);
        }
      }
      return folder;
    };

    for (const folder of rootFolders) {
      await populateChildren(folder);
    }

    if (rootFolders.length === 0 && subfolders.length === 0) {
      return res.status(404).json({ message: "No folders found" });
    }

    return res.status(200).json({ rootFolders, subfolders });
  } catch (error) {
    console.error("Error fetching folders:", error);
    return res.status(500).json({ message: "Error fetching folders", error });
  }
};

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
  folder.name = foldername
  await folder.save()
  res.status(201).json(folder)
}

const getFolderWorkSearch = async (req, res) => {
  const query = req.query.query;
  const {id} = req.params; 
  if (!query || query.trim() === "") {
    return res.status(400).json({ message: "Search query is required" });
  }

  try {
    let foldersToSearch;

    if (id) {
      const targetFolder = await Folder.findById(id);
      if (!targetFolder) {
        return res.status(404).json({ message: "Folder not found" });
      }

      foldersToSearch = [targetFolder];
    } else {
      foldersToSearch = await Folder.find({});
    }

    const matchingWorkItems = [];

    foldersToSearch.forEach((folder) => {
      const matchedWork = folder.work.filter((work) => {
        const nameMatch = work.name.toLowerCase().includes(query.toLowerCase());
        const sizeMatch = work.size.toLowerCase().includes(query.toLowerCase());
        return nameMatch || sizeMatch;
      });

      if (matchedWork.length > 0) {
        matchingWorkItems.push(...matchedWork);
      }
    });

    if (matchingWorkItems.length === 0) {
      return res.status(200).json({ message: "No matching work items found", data: [] });
    }

    return res.status(200).json(matchingWorkItems);
  } catch (error) {
    console.error("Error searching folders:", error);
    return res.status(500).json({ message: "Internal server error" });
  }
}

const folderDeleteWork=async(req,res)=>{
  const id=req.params.id;
  const { folderid } = req.query;
  const singleFolder = await Folder.findById(folderid);
  if (!singleFolder) {
    return res.status(404).json({ message: "folder not found" })
  }
  const workItem = singleFolder.work.findIndex(item => item._id == id);
  if (workItem===-1) {
    return res.status(404).json({ message: "workitem not found" })
  }

  singleFolder.work.splice(workItem,1)

  const updateFolder=await singleFolder.save();
  res.status(201).json(updateFolder)

};

const deleteFolder=async(req,res)=>{
  const folderId=req.params.id;
  if(!folderId){
    return res.status(404).json({message:"folder not found"})
  }
  const findFolder=await Folder.findByIdAndDelete(folderId);

  if(findFolder){
    return res.status(201).json(findFolder)
  }

}

module.exports = {
  folderControll,
  getFolder,
  folderUpdate,
  folderCollectedTk,
  folderRename,
  getFolderWorkSearch,
  folderDeleteWork,
  deleteFolder
}