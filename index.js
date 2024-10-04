const connectToMango = require('./db')
const express = require('express')
const app = express();
var cors = require('cors');
const secret = require('./secret.js')
require('dotenv').config(); // This will load the .env file
app.use(cors());
app.use(express.json());
const port = process.env.PORT || 5000;
app.listen(port, () => {
  console.log("connection established");
});
// connectToMango();
const { AadharController } = require('./Controllers/Register.js');
const { SessionController } = require('./Controllers/Session.js');
const urls = require('./urls.js')
const aadharController = new AadharController();
const sessionController = new SessionController();
app.get('/', async (req, res) => {
  var myHeaders = new Headers();
  myHeaders.append("Content-Type", "application/json");

  var raw = JSON.stringify({
    "clientId": "SBXTEST_03",
    "clientSecret": "ca19aa52-5635-431e-9dd2-e363ecd90a81",
    "grantType": "client_credentials",
    "refreshToken": "string"
  });

  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };

  try {
    const response = await fetch("https://dev.abdm.gov.in/gateway/v0.5/sessions", requestOptions);
    if (!response.ok) {
      throw new Error(`Error: ${response.status}`);
    }
    const result = await response.json(); 
    secret.accessToken= result.accessToken
    secret.refreshToken = result.refreshToken
    console.log(secret.accessToken);
    res.json({ message: "Successfully generated session", accessToken:`${result.accessToken}`});
  } catch (error) {
    res.json({ error });
  }

})

app.post('/aadhar/otp', async (req, res) => {
  const body = req.body;
  console.log(body);
  var myHeaders = new Headers();
  const timestamp = new Date().toISOString();
  const encryptedAadhar = await aadharController.encrypt(body.aadhar);
myHeaders.append("Content-Type", "application/json");
myHeaders.append("REQUEST-ID", "12b749e2-bce1-4554-84a0-2eb8b15e150e");
myHeaders.append("TIMESTAMP", timestamp);
myHeaders.append("Authorization", `Bearer ${secret.accessToken}`);
var raw = JSON.stringify({
  "scope": [
    "abha-enrol"
  ],
  "loginHint": "aadhaar",
  "loginId": `${ encryptedAadhar.encryptedOutput }`,
  "otpSystem": "aadhaar"
});

var requestOptions = {
  method: 'POST',
  headers: myHeaders,
  body: raw,
  redirect: 'follow'
};

fetch("https://abhasbx.abdm.gov.in/abha/api/v3/enrollment/request/otp", requestOptions)
  .then(response => response.json())
  .then((result) => {
    secret.lastTxnId = `${result.txnId}`
    res.status(200).json({result})
  })
  .catch(error => res.status(404).json({'error': "Wait for some time or try for other user"}));
  
})

app.post('/enrol/byaadhar', async (req, res)=>{
  const { otp, txnId } = req.body
  console.log(otp, ' ', txnId);
  try{
  const encryptedOtp = await aadharController.encrypt(otp);
  var myHeaders = new Headers();
  const timestamp = new Date().toISOString();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("REQUEST-ID", "abdc018d-1e94-4834-9070-788af48b17b3");
  myHeaders.append("TIMESTAMP", timestamp);
  myHeaders.append("Authorization",  `Bearer ${secret.accessToken}`);

var raw = JSON.stringify({
  "authData": {
    "authMethods": [
      "otp"
    ],
    "otp": {
      "timeStamp":timestamp,
      "txnId": txnId,
      "otpValue": encryptedOtp,
      "mobile": "9347549195"
    }
  },
  "consent": {
    "code": "abha-enrollment",
    "version": "1.4"
  }
})
var requestOptions = {
  method: 'POST',
  headers: myHeaders,
  body: raw,
  redirect: 'follow'
};

fetch("https://abhasbx.abdm.gov.in/abha/api/v3/enrollment/enrol/byAadhaar", requestOptions)
  .then(response => response.json())
  .then((result) => {
    console.log(result)
    res.status(200).json({result})
  }
  )
  }
  catch(err){
    res.status(404).send('Invalid OTP')
  }
});

// mobile otp generation to verify the aadhar card
//mobile otp
app.post('/requestMobileOtp',async(req,res)=>{
  var myHeaders = new Headers();
  const timestamp = new Date().toISOString();
  console.log(req.body.mobile);
  const encryptedMobile=await aadharController.encrypt(req.body.mobile);
  console.log(encryptedMobile);
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("REQUEST-ID", "9e01983a-5e78-4aa1-a241-e8c43ee56a98");
  myHeaders.append("TIMESTAMP", timestamp);
  myHeaders.append("Authorization", `Bearer ${secret.accessToken}`);
  // console.log("id", encryptedMobile.encryptedOutput);
  var raw = JSON.stringify({
    "txnId": "",
    "scope": [
      "abha-enrol",
      "mobile-verify"
    ],
    "loginHint": "mobile",
    "loginId": `${ encryptedMobile.encryptedOutput }`,
    "otpSystem": "abdm"
  });

  var requestOptions = {
    method: 'POST',
    headers: myHeaders,
    body: raw,
    redirect: 'follow'
  };

  fetch("https://abhasbx.abdm.gov.in/abha/api/v3/enrollment/request/otp", requestOptions)
    .then(response => response.text())
    .then(result => res.status(200).json({'res':result}))
    .catch(error => res.status(400).json({'error': error}));
});

//verification
app.post('/verifymobileotp',async(req,res)=>{
  var myHeaders = new Headers();
  const timestamp=new Date().toISOString();
  myHeaders.append("Content-Type", "application/json");
  myHeaders.append("REQUEST-ID", "8223a00e-dcbc-481e-929d-ea1a5df1c9a3");
  myHeaders.append("TIMESTAMP", timestamp);
  myHeaders.append("Authorization", `Bearer ${secret.accessToken}`);
  const encryptedotp=await aadharController.encrypt(req.body.otp);

var raw = JSON.stringify({
  "scope": [
    "abha-enrol",
    "mobile-verify"
  ],
  "authData": {
    "authMethods": [
      "otp"
    ],
    "otp": {
      "timeStamp": timestamp,
      "txnId": "transaction id",
      "otpValue": encryptedotp.encryptedOutput
    }
  }
});

var requestOptions = {
  method: 'POST',
  headers: myHeaders,
  body: raw,
  redirect: 'follow'
};

fetch("https://abhasbx.abdm.gov.in/abha/api/v3/enrollment/auth/byAbdm", requestOptions)
  .then(response => response.text())
  .then(result => res.status(200).json({'res':result}))
  .catch(error => res.status(400).json({'error': error}));
})
