const urls = require('./../urls');
class AadharController {
    constructor() {}

    registerUser(data) {
        return new Promise(async (done, reject) => {
            try {
                const encryptedAadhar = await this.encryptAadhar(data.aadhar);
                console.log(encryptedAadhar); // Corrected the variable name
                
            } catch (err) {
                console.log(err);
                reject(err); // Reject the promise if an error occurs
            }
        });
    }

    async encryptAadhar(aadharNumber) {
        try {
            const body = {
                "textToEncrypt": aadharNumber + "",
                "publicKey": "MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAK4LdQKvE3H/Q0BbW0bg85oYf5oN0IAeoTFTiBBbzXEsQt1swdOvr9r/Gun9F+QQyRTomrtfTC7IzOXlpOc/OfsCAwEAAQ==",
                "privateKey": "MFwwDQYJKoZIhvcNAQEBBQADSwAwSAJBAK4LdQKvE3H/Q0BbW0bg85oYf5oN0IAeoTFTiBBbzXEsQt1swdOvr9r/Gun9F+QQyRTomrtfTC7IzOXlpOc/OfsCAwEAAQ==",
                "keyType": "publicKeyForEncryption",
                "cipherType": "RSA/ECB/PKCS1Padding"
            };

            const response = await fetch(urls.encrypt_url, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(body), // Make sure body is a JSON string
            });

            if (!response.ok) {
                throw new Error('Network response was not ok');
            }

            const result = await response.json(); // Parse the response as JSON
            return result;
        } catch (error) {
            console.log('Error encrypting Aadhar:', error);
            throw error; // Re-throw the error for handling in the calling function
        }
    }
}

module.exports = { AadharController };
