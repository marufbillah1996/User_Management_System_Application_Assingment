const   express     = require('express'),
        Pool        = require('pg-pool'),
        bcrypt      = require('bcrypt'),
        userRouter  = express.Router(),
        auth        = require('../middlewires/auth'); 
        const fileUpload = require('express-fileupload');
        const path = require('path');   
        const uniqueFilename = require('unique-filename');
const   pool = new Pool({
        user: 'postgres',
        host: 'localhost',
        database: 'UMSystemDb',
        password: 'Maruf123',
        port: 5432
    });

userRouter.get("/users", auth, async (req, res)=>{
    let client = await pool.connect();
    try
    {
        var results = await client.query('SELECT * FROM users');
        res.status(200).json(results.rows)
    }
    catch (e)
    {
        res.status(500).json("Server error");
        console.error(e.message, e.stack);
    }
    finally{
        client.release();
    }  
});
userRouter.get("/users/:id",auth, async (req, res)=>{
    let id= req.params.id;
    let client = await pool.connect();
    try
    {
        var results = await client.query('SELECT userid, username,firstname,lastname,fullname,gender,address,birthdate, email, mobile FROM users WHERE userid=$1', [id]);
        console.log(results.rows[0])
        res.status(200).json(results.rows[0])
    }
    catch (e)
    {
        res.status(500).json("Server error");
        console.error(e.message, e.stack);
    }
    finally{
        client.release();
    }  
});
userRouter.get("/users/name/:name",auth, async (req, res)=>{
    let name= req.params.name;
    console.log(`SELECT userid, username,firstname,lastname,fullname,gender,address,birthdate, email, mobile, picture FROM users WHERE LOWER(username)=LOWER(${name})`)
    let client = await pool.connect();
    
    try
    {
        var results = await client.query('SELECT userid, username,firstname,lastname,fullname,gender,address,birthdate, email, mobile, picture FROM users WHERE LOWER(username)=LOWER($1)', [name]);
        console.log(results.rows[0])
        res.status(200).json(results.rows[0])
    }
    catch (e)
    {
        res.status(500).json("Server error");
        console.error(e.message, e.stack);
    }
    finally{
        client.release();
    }  
});
userRouter.post("/users", auth, async (req, res)=>{
    let {username, password,firstname,lastname, fullname,gender,address, birthdate, email, mobile}=req.body;
    let hash =await bcrypt.hash(password, 10);
    //console.log(hash);
    let client = await pool.connect();
    try
    {
        var results = await client.query('INSERT INTO users (username, firstname,lastname, fullname, gender,address, birthdate, email, mobile) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *',[username, hash,firstname,lastname, fullname,gender,address, birthdate, email, mobile]);
        res.status(201).json(results.rows[0]);
    }
    catch (e)
    {
        res.status(500).json("Server error");
        console.error(e.message, e.stack);
    }
    finally{
        client.release();
    }  
    //res.status(201).json('user created');
});
userRouter.put("/users/:id",auth,async (req, res)=>{
    let id = req.params.id
    let {username, password,firstname,lastname, fullname,gender,address, birthdate, email, mobile}=req.body;
    
    let client = await pool.connect();
    try
    {
        var results = await client.query('UPDATE users SET firstname=$1,lastname=$2, fullname=$3,gender=$4,address=$5, birthdate=$6, email=$7, mobile=$8 WHERE userid=$9 RETURNING *',[firstname,lastname,fullname,gender,address, birthdate, email, mobile, id]);
        res.status(204).json('Updated');
    }
    catch (e)
    {
        res.status(500).json("Server error");
        console.error(e.message, e.stack);
    }
    finally{
        client.release();
    }  
    //res.status(201).json('user created');
});
userRouter.delete("/users/:id",auth, async (req, res)=>{
    let id = req.params.id
  

    //console.log(hash);
    let client = await pool.connect();
    try
    {
        var results = await client.query('DELETE FROM users WHERE userid=$1',[id]);
        res.status(200).json(true);
    }
    catch (e)
    {
        res.status(500).json("Server error");
        console.error(e.message, e.stack);
    }
    finally{
        client.release();
    }  
    //res.status(201).json('user created');
});
userRouter.post("/users/upload/:name", auth, async(req, res)=>{
    //console.log(req.files.pic);
    let username= req.params.name;
    let file = req.files.pic;
    let ext = path.extname(file.name);
    var savePath = path.join(__dirname,'../uploads');
    let f= uniqueFilename(savePath)+ext;
    let bf = path.basename(f);
    console.log(f);
    file.mv(f, err=>{
        if(err)
            res.status(500).json(err);
       
    })
    //console.log(hash);
    let client = await pool.connect();
    
    try
    {
        var results = await client.query('UPDATE  users SET picture=$1 WHERE LOWER(username)=LOWER($2)',[ bf, username]);
        console.log(results);
        res.status(200).json({imgname:bf});
    }
    catch (e)
    {
        res.status(500).json("Failed to update");
        console.error(e.message, e.stack);
        
    }
    finally{
        client.release();
    }  
    //res.status(200).json(req.files.pic.name)
});
module.exports = userRouter;