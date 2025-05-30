const express=require('express');
const { addProduct, getProduct, getSizeAndQuantityCulc, collectedTk, calculateTotalCollectedTk, getSearchData, deleteWork } = require('../controllers/productControll');
const { folderControll, getFolder, folderUpdate, folderCollectedTk, folderRename, getFolderWorkSearch, folderDeleteWork, deleteFolder, checkDuesOrCollected } = require('../controllers/folderControll');
const { saveExpense, getAllExpense, getTotalExpenseAmount } = require('../controllers/expenseControll');
const { addDiposite, getDipositeData } = require('../controllers/dipositeControll');
const router=express.Router();

router.post("/addProduct",addProduct);
router.post("/new-folder",folderControll)
router.get("/all-product",getProduct);
router.get("/sizeAndQuantityCalu/:id",getSizeAndQuantityCulc)
router.get("/all-folder",getFolder)
router.patch("/addwork/:id",folderUpdate)
router.patch("/collected-tk/:id",collectedTk)
router.patch("/folder-collected-tk/:id",folderCollectedTk)
router.patch("/rename-folder/:id",folderRename)
router.post("/expense/",saveExpense)
router.get("/all-expense/",getAllExpense)
router.get("/total-expense/",getTotalExpenseAmount)
router.get("/total-collected/",calculateTotalCollectedTk)
router.post("/diposite-in-office/",addDiposite)
router.get("/diposite-data/",getDipositeData)
router.get("/search/",getSearchData)
router.get("/search-folder-work/:id",getFolderWorkSearch)
router.delete("/delete-work/:id",deleteWork)
router.delete("/folder-delete-work/:id",folderDeleteWork)
router.delete("/delete-folder/:id",deleteFolder)
router.get("/options/:id",checkDuesOrCollected)

module.exports=router;