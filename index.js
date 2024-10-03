const connectToMango=require('./db')
const express=require('express')
const app=express();
var cors=require('cors');
require('dotenv').config(); // This will load the .env file
app.use(cors());
app.use(express.json());
const port = process.env.PORT || 5000;
app.listen(port,()=>{
    console.log("connection established");
});
// connectToMango();
const { AadharController } = require('./Controllers/Register.js');
const { SessionController } = require('./Controllers/Session.js');
const aadharController = new AadharController();
const sessionController = new SessionController();
app.get('/', async (req, res) => {
    // res.json(`server is running on port ${port}`);
    sessionController.generateSession({
      clientId:process.env.Client_Id,
      clientSecret:process.env.Client_Secret,
    })
  .then(result => {
      res.json({
        sucess:true,
        data: result,
      })
    })
    .catch(error => {
      res.json({
        success: false,
        message: error
      })
    })
  })

  app.post('/aadhar/otp', async (req, res)=>{
    const body = req.body;
    console.log(body);
    aadharController.registerUser(body)
  .then(result => {
      res.json({
        sucess:true,
        data: result,
      })
    })
    .catch(error => {
      res.json({
        success: false,
        message: error
      })
  })
})
