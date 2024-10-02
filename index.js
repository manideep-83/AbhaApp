const connectToMango=require('./db')
const express=require('express')
const app=express();
var cors=require('cors');
app.use(cors());
app.use(express.json());

app.listen(5000,()=>{
    console.log("connection established");
});
connectToMango()