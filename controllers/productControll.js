const Folder = require("../models/folderModels");
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
        const separator = size.includes("*") ? "*" :
          size.includes("/") ? "/" :
            size.includes("x") ? "x" : "-"
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
  const product = await products.find({}).sort({ _id: -1 });
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
      dues: Number(dues.dues)
    }
  })
  res.status(201).json(updateTk)
}

const getSizeAndQuantityCulc = async (req, res) => {
  // const product=await products.find({});
  const { id } = req.params;
  const singleId = id.split(",");
};

async function calculateCollectedTk(folderId) {
  let totalCollectedTk = 0;

  const folder = await Folder.findById(folderId).populate("children").populate("work");

  if (!folder) {
    throw new Error("Folder not found");
  }

  if (folder.work && folder.work.length > 0) {
    for (const product of folder.work) {
      if (product.collectedTk) {
        totalCollectedTk += parseFloat(product.collectedTk) || 0;
      }
    }
  }

  if (folder.children && folder.children.length > 0) {
    for (const childFolderId of folder.children) {
      totalCollectedTk += await calculateCollectedTk(childFolderId);
    }
  }

  return totalCollectedTk;
}

async function calculateTotalCollectedTk(req, res) {
  let totalCollectedTk = 0;

  const allProducts = await products.find({});
  for (const product of allProducts) {
    if (product.collectedTk) {
      totalCollectedTk += parseFloat(product.collectedTk) || 0;
    }
  }

  const rootFolders = await Folder.find({ parent: null });
  for (const rootFolder of rootFolders) {
    totalCollectedTk += await calculateCollectedTk(rootFolder._id);
  }

  res.status(201).json(totalCollectedTk);
};

const getSearchData = async (req, res) => {
  const query = req.query.query;
  const allProduct = await products.find({})
  if (!query) {
    return res.status(404).json({ message: "search data not found" })
  }
  const result = allProduct.filter((product) => {
    const nameMatch = product.name.toLowerCase().includes(query.toLowerCase());
    const sizeMatch = product.size.toLowerCase().includes(query.toLowerCase());
    return nameMatch || sizeMatch;
  });
  return res.status(201).json(result)
}


module.exports = {
  addProduct,
  getProduct,
  getSizeAndQuantityCulc,
  collectedTk,
  calculateTotalCollectedTk,
  getSearchData
};
