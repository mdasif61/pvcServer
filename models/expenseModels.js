const mongoose = require("mongoose");

const expenseModels = mongoose.Schema({
    title: { type: String, required:true },
    amount: { type: String, required: true }
},
    { timestamps: true }
);

const Expense = mongoose.model("Expense", expenseModels);
module.exports = Expense;