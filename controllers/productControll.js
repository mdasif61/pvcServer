const products = require("../models/productModels");

const addProduct = async (req, res) => {
  const { name, size, quantity, rate, sqft, amount, total, collectedTk, dues } = req.body;

  const productData = await products.create({
    name,
    size,
    quantity,
    rate,
    sqft,
    amount,
    total,
    collectedTk,
    dues
  });

  if (productData) {
    const allProduct = await products.find({});
    const modifiProduct = allProduct.map(async (item) => {
      const size = item.size;

      if (size && size.includes("*") || size.includes("/") || size.includes("x") || size.includes("-")) {
        const separator = size.includes("*")?"*":
                          size.includes("/")?"/":
                          size.includes("x")?"x":"-"
        const [width, height] = size.split(separator).map(Number);
        const Sft = width * height;

        const quantiy = Number(item?.quantity);
        const totalSft = Sft * quantiy;
        // console.log(totalSft);

        try {
          const updateDoc = await products.findByIdAndUpdate(item?.id, {
            $set: {
              sqft: totalSft,
              amount: totalSft * Number(item?.rate)
            },
          });
          // console.log(updateDoc);
        } catch (error) { }
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

const collectedTk = async (req, res) => {
  const { id } = req.params;
  const { collectedAndduesAmount } = req.body;
  const [collectedTk, dues] = collectedAndduesAmount;

  const updateTk = await products.findByIdAndUpdate(id, {
    $set: {
      collectedTk: Number(collectedTk.collectedTk),
      dues:Number(dues.dues)
    }
  })
  res.status(201).json(updateTk)
}

const getSizeAndQuantityCulc = async (req, res) => {
  // const product=await products.find({});
  const { id } = req.params;
  const singleId = id.split(",");
};

module.exports = {
  addProduct,
  getProduct,
  getSizeAndQuantityCulc,
  collectedTk
};
