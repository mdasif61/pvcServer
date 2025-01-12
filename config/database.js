const mongoose= require('mongoose');

const connectDb=async()=>{
    try {
        const connection=await mongoose.connect(process.env.MONGO_URI,{
            dbName:"pvc"
        });
        console.log("Database Connected :", connection.connection.host)
    } catch (error) {
        console.log(error);
        process.exit();
    }
};

module.exports=connectDb;