const       jwt = require("jsonwebtoken");
const       fs = require('fs');
const       path = require('path');

const auth  = (req, res, next)=>{
   let key = fs.readFileSync(path.join(__dirname,"../constants.txt"));
   console.log(key.toString());
    try{
        let headerValue = req.headers.authorization;
       console.log(headerValue)
       if(headerValue){
        let v = headerValue.split(' ')[1];
        let token = jwt.verify(v, key.toString());
        console.log(token.username);
        req.username = token.username;
        next();
       }
       else
       {
            res.status(401).json({message: 'Unauthorized user'});
       }
    }
    catch(e)
    {
        res.status(401).json({message: 'Unauthorized user'});
    }
   
}
module.exports = auth;