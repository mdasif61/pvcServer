const express=require('express');
const { addProduct, getProduct } = require('../controllers/productControll');
const router=express.Router();

router.post("/addProduct",addProduct);
router.get("/all-product",getProduct);

module.exports=router;