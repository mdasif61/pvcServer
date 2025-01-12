const products = require("../models/productModels");

const addProduct = async (req, res) => {
  const { name, size, quantity, amount, total } = req.body;
  console.log(req.body)

  const productData = await products.create({
    name,
    size,
    quantity,
    amount,
    total,
  });
  if (productData) {
    res.status(201).json({
      name,
      size,
      quantity,
      amount,
      total,
    });
  }
};

const getProduct=async(req,res)=>{
  const product=await products.find({});
  if(!product){
    return res.status(404).json({message:"product not found"})
  };
  return res.status(200).json(product)
}

module.exports = {
  addProduct,
  getProduct
};
