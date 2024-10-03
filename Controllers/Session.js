
const urls = require('./../urls')
class SessionController{
    constructor(){}
    generateSession(data){
        return new Promise((done, reject)=>{
            console.log('session url  ',urls.session_url);
            fetch(urls.session_url, {
              method: 'POST', // Specifies the request type
              headers: {
                'Content-Type': 'application/json', // Ensures the server treats the request body as JSON
              },
              body: JSON.stringify(data), // Converts JavaScript object to a JSON string
            })
              .then(response => {
                if (!response.ok) {
                  return reject('Network response was not ok');
                }
                return done(response); 
        })
    })
    }
}
module.exports ={ SessionController }