const express=require('express');
const { addProduct, getProduct, getSizeAndQuantityCulc, collectedTk } = require('../controllers/productControll');
const { folderControll, getFolder, folderUpdate, folderCollectedTk } = require('../controllers/folderControll');
const router=express.Router();

router.post("/addProduct",addProduct);
router.post("/new-folder",folderControll)
router.get("/all-product",getProduct);
router.get("/sizeAndQuantityCalu/:id",getSizeAndQuantityCulc)
router.get("/all-folder",getFolder)
router.patch("/addwork/:id",folderUpdate)
router.patch("/collected-tk/:id",collectedTk)
router.patch("/folder-collected-tk/:id",folderCollectedTk)

module.exports=router;