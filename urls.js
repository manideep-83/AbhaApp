let urls = {
    baseurl:'https://abhasbx.abdm.gov.in',
    sendOtp: `${this.baseurl}/abha/api/v3/enrollment/request/otp`, //to send otp
    verifyAadhar: `${this.baseurl}/abha/api/v3/enrollment/enrol/byAadhaar`, //to verify otp
    encrypt_url : 'https://www.devglan.com/online-tools/rsa-encrypt',
    session_url : 'https://dev.abdm.gov.in/api/hiecm/gateway/v3/sessions',
    

}
module.exports = urls;