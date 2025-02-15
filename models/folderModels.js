const mongoose = require("mongoose");

// const folderModels = mongoose.Schema(
//   {
//     name: { type: String, required: true },
//     type: { type: String, enum: ["folder", "file"], required: true },
//     children: [

//     ],
//     work: [
//       {
//         _id: { type: mongoose.Schema.Types.ObjectId, default:()=>new mongoose.Types.ObjectId },
//         name: { type: String },
//         size: { type: String },
//         quantity: { type: String },
//         rate: { type: String },
//         sqft: { type: String },
//         amount: { type: String },
//         total: { type: String },
//         collectedTk: { type: String },
//         dues: { type: String },
//       },
//     ],
//     parent:{type:String}
//   },
//   { timestamps: true }
// );

const folderModels = new mongoose.Schema({
  name: { type: String, required: true }, 
  type: { type: String, default: "folder" },
  children: [{ type: mongoose.Schema.Types.ObjectId, ref: "Folder" }],
  work: [{ type: mongoose.Schema.Types.ObjectId, ref: "Work" }],
  parent: { type: mongoose.Schema.Types.ObjectId, ref: "Folder", default: null },
});

const Folder = mongoose.model("Folder", folderModels);

module.exports = Folder;
