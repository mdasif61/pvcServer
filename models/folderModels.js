const mongoose = require("mongoose");

const folderModels = mongoose.Schema(
  {
    name: { type: String, required: true },
    type: { type: String, enum: ["folder", "file"], required: true },
    children: [
      
    ],
    work:[]
  },
  { timestamps: true }
);

const Folder = mongoose.model("Folder", folderModels);

module.exports = Folder;
