const express=require('express');
const { addProduct, getProduct, getSizeAndQuantityCulc } = require('../controllers/productControll');
const { folderControll, getFolder, folderUpdate } = require('../controllers/folderControll');
const router=express.Router();

router.post("/addProduct",addProduct);
router.post("/new-folder",folderControll)
router.get("/all-product",getProduct);
router.get("/sizeAndQuantityCalu/:id",getSizeAndQuantityCulc)
router.get("/all-folder",getFolder)
router.patch("/addwork/:id",folderUpdate)

module.exports=router;