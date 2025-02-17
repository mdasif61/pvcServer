const Expense = require("../models/expenseModels");

const saveExpense=async(req,res)=>{
    const {title,amount}=req.body;

    const newExpense=new Expense({
        title,
        amount
    });

    const saveExpenseDb=await newExpense.save();
    return res.status(201).json(saveExpenseDb)

};

const getAllExpense=async(req,res)=>{
    const allExpense=await Expense.find({});
    if(!allExpense){
        return res.status(404).json({message:"expnese not found"})
    }
    return res.status(201).json(allExpense)
}

const getTotalExpenseAmount=async(req,res)=>{
   try {
    const allExpense=await Expense.find({});
    const totalSum=allExpense.reduce((sum,expense)=>{
        return sum+Number(expense.amount)
    },0)
    return res.status(201).json(totalSum)
   } catch (error) {
    return res.status(404).json({message:"expense not found"})
   }
}

module.exports={
    saveExpense,
    getAllExpense,
    getTotalExpenseAmount
}