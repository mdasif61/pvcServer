const mongoose = require("mongoose");

const folderModels = mongoose.Schema(
  {
    name: { type: String, required: true },
    type: { type: String, enum: ["folder", "file"], required: true },
    children: [
      {
        name:{type:String,required:true},
        type:{type:String,required:true},
        children:[]
    }
    ],
  },
  { timestamps: true }
);

const Folder = mongoose.model("Folder", folderModels);

module.exports = Folder;
