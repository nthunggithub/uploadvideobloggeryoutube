const {google} = require('googleapis');
const fs = require('fs');
const token_ = 'token.json';

var oauth2Client = new google.auth.OAuth2(
    "300587230369-hr7ouon98mu9jcq8qh6eiip2t69sdcs1.apps.googleusercontent.com",
    "AVx3YfbLF32fmDzQF53CMrVj",
    ["http://localhost:3000/oauth2callback"]
  );
  
  const scopes = [
    'https://www.googleapis.com/auth/youtube.upload',
    'https://www.googleapis.com/auth/youtube',
    'https://www.googleapis.com/auth/blogger',
    'https://www.googleapis.com/auth/photoslibrary',
    'profile',
  ];
  
  const url = oauth2Client.generateAuthUrl({
    // 'online' (default) or 'offline' (gets refresh_token)
    access_type: 'offline',
   
    // If you only need one scope you can pass it as a string
    scope: scopes
});
  

module.exports.getapi  = async(req, res)=>{
    //var code = "https://accounts.google.com/o/oauth2/v2/auth?access_type=offline&scope=https%3A%2F%2Fwww.googleapis.com%2Fauth%2Fblogger&response_type=code&client_id=789910653492-j1ufqacs4k3nv22mpffjgvj3l7kvo2r9.apps.googleusercontent.com&redirect_uri=http%3A%2F%2Flocalhost%3A3000%2Foauth2callback"
    console.log(url);
    
    res.redirect(url);
}

module.exports.oauth2callback = async (req, res, next)=>{
    console.log(req.query.code);
    const {tokens} = await oauth2Client.getToken(req.query.code)
    // oauth2Client.setCredentials(tokens);
    // console.log(tokens);
    fs.writeFile(token_, JSON.stringify(tokens), (err)=>{
      if(err) console.log(err);
    })
    res.send(tokens);
};

module.exports.oauth2Client  = oauth2Client;