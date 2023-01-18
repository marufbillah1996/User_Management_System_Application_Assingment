const   express     = require('express'),
        app         = express(),
        cors        = require("cors");

        const fileUpload = require('express-fileupload');       
        var morgan = require('morgan');
        var fs = require('fs');
        var path = require('path');
const userRouter = require("./controllers/usersController");
const accRouter = require("./controllers/accountController");

//////////////Middlewires
const   corsOptions = {
    origin: 'http://localhost:4200'
    
  };
app.use(express.static(__dirname));
const  accessLogStream = fs.createWriteStream(path.join(__dirname, 'access.log'), { flags: 'a' })

app.use(cors(corsOptions));
app.use(express.json());
app.use(fileUpload());
app.use(morgan('combined', { stream: accessLogStream }))
app.use("/api", userRouter);
app.use("/api/Account", accRouter)
/////////////////////////////////////
app.listen(5000, ()=>{
    console.log('Server running on port 5000');
});