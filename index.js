const express= require('express')
const cors=require('cors');
const router=require('./routes/router');
const connectDb = require('./config/database');
const port= process.env.PORT||5000;
require("dotenv").config();

connectDb()
const app=express();

app.use(cors());
app.use(express.json());
app.use("/api",router);

app.get('/',(req,res)=>{
    res.send("Test Server")
})

app.listen(port,()=>{
    console.log("Server running port :", port)
})

// MONGO_URI=mongodb+srv://pvcMan:d7EAomGU7z4JwKIU@cluster0.kuomool.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0