const products = require("../models/productModels");

const addProduct = async (req, res) => {
  const { name, size, quantity, rate, sqft, amount, total } = req.body;

  const productData = await products.create({
    name,
    size,
    quantity,
    rate,
    sqft,
    amount,
    total,
  });

  if (productData) {
    const allProduct = await products.find({});
    const modifiProduct = allProduct.map(async(item) => {
      const size = item.size;

      if (size && size.includes("*")) {
        const [width, height] = size.split("*").map(Number);
        const Sft = width * height;

        const quantiy = Number(item?.quantity);
        const totalSft = Sft * quantiy;
        // console.log(totalSft);

        try {
          const updateDoc =await products.findByIdAndUpdate(item?.id, {
            $set: {
              sqft: totalSft,
              amount:totalSft*Number(item?.rate)
            },
          });
          console.log(updateDoc);
        } catch (error) {}
      }
    });
  }

  if (productData) {
    res.status(201).json({
      name,
      size,
      quantity,
      rate,
    });
  }
};

const getProduct = async (req, res) => {
  const product = await products.find({});

  // const modifiProduct = product.map((item) => {
  //   const size = item.size;

  //   if (size && size.includes("*")) {
  //     const [width, height] = size.split("*").map(Number);
  //     const Sft = width * height;

  //     const quantiy = Number(item?.quantity);
  //     const totalSft = Sft * quantiy;
  //     console.log(totalSft);
  //   }
  // });

  if (!product) {
    return res.status(404).json({ message: "product not found" });
  }
  return res.status(200).json(product);
};

const getSizeAndQuantityCulc = async (req, res) => {
  // const product=await products.find({});
  const { id } = req.params;
  const singleId = id.split(",");
};

module.exports = {
  addProduct,
  getProduct,
  getSizeAndQuantityCulc,
};
