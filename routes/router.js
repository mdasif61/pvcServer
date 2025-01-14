const express=require('express');
const { addProduct, getProduct, getSizeAndQuantityCulc } = require('../controllers/productControll');
const router=express.Router();

router.post("/addProduct",addProduct);
router.get("/all-product",getProduct);
router.get("/sizeAndQuantityCalu/:id",getSizeAndQuantityCulc)

module.exports=router;