const connectToMango=require('./db')
const express=require('express')
const app=express();
var cors=require('cors');
app.use(cors());
app.use(express.json());
app.get('/',(req,res)=>{
    res.send("This is starting of Abha app Testing backend");
});
app.listen(5000,()=>{
    console.log("connection established");
});
connectToMango()