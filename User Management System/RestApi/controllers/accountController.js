const   express     = require('express'),
        jwt         = require("jsonwebtoken")
        accountRouter  = express.Router(),
        repo        = require('../repo/userRepo');
        const       fs = require('fs');
        const       path = require('path');
accountRouter.post('/login', async(req, res)=>{
    //console.log('login')
    let key = fs.readFileSync(path.join(__dirname,"../constants.txt"));
    console.log(key.toString());
    let {username, password}=req.body;
    let userFound = await repo.userNameExists(username);
    if(!userFound) return res.status(404).json({message: 'User not found'});
    let verified = await repo.checkUserCredential(username, password);
    if(!verified) return res.status(400).json({message: 'Username or password invalid'});
    let token = jwt.sign({username:username}, key.toString(), {expiresIn:'1200s'});
    let refreshToken = jwt.sign({username:username}, key.toString(), {expiresIn:'1d'});
    res.status(200).json({username:username, token:token, refreshToken:refreshToken});
});
accountRouter.post('/register', async(req, res)=>{
    let {username, password,firstname,lastname, fullname,gender,address, birthdate, email, mobile}=req.body;
    console.log({username, password,firstname,lastname, fullname,gender,address, birthdate, email, mobile});
    let result = await repo.createUser({username, password,firstname,lastname, fullname,gender,address, birthdate, email, mobile});
    if(result)
        res.status(201).json(result.username+ ' created');
    else
    res.status(500).json('Registration failed');
    //res.status(200).json('ok');
});
accountRouter.get("/name/exists/:name", async (req, res)=>{
    let username = req.params.name;
    //console.log(username)
    let found=await repo.userNameExists(username);
    //console.log(found);
    return res.status(200).json(found);
});
accountRouter.get("/email/exists/:email", async (req, res)=>{
    let email = req.params.email;
   // console.log(email)
    let found=await repo.emailExists(email);
   // console.log(found);
    return res.status(200).json(found);
});
module.exports = accountRouter;