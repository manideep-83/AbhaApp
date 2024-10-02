const mongoose=require('mongoose')
const mongouri="mongodb+srv://manideep_834:manideep0030@chatappdb.welbakk.mongodb.net/ABHA?retryWrites=true&w=majority&appName=ChatAppDb"
const connectToMango=async()=>{
    try {
        await mongoose.connect(mongouri);
        console.log("connected TO database");    
    } catch (error) {
        console.log("Not connected to db");
    } 
};
module.exports=connectToMango;