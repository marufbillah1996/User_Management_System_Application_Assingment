const   express     = require('express'),
        Pool        = require('pg-pool'),
        bcrypt      = require('bcrypt');
const   pool = new Pool({
            user: 'postgres',
            host: 'localhost',
            database: 'UMSystemDb',
            password: 'Maruf123',
            port: 5432
        });
const userNameExists = async (username)=>{
    let client = await pool.connect();
    let found = false;
    try
    {
        var results = await client.query('SELECT 1 FROM users WHERE LOWER(username)=LOWER($1)', [username]);
        console.log(results.rows.length)
        if(results.rows.length> 0)
            found= true;
       
       
    }
    catch (e)
    {
        
        console.error(e.message, e.stack);
        
    }
    finally{
        client.release();
    }  
    
    return found;
}
const emailExists = async (email)=>{
    let client = await pool.connect();
    let found = false;
    try
    {
        var results = await client.query('SELECT * FROM users WHERE LOWER(email)=LOWER($1)', [email]);
        console.log(results.rows.length)
        if(results.rows.length> 0)
            found= true;
    }
    catch (e)
    {
        
        console.error(e.message, e.stack);
        
    }
    finally{
        client.release();
    }  
    console.log(found);
    return found;
}
const createUser= async (user)=>{
    let hash =await bcrypt.hash(user.password, 10);
    //console.log(hash);
    let client = await pool.connect();
    let r= null;
    try
    {
        var results = await client.query('INSERT INTO users (username, password,firstname,lastname, fullname,gender,address, birthdate, email, mobile) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10) RETURNING *',[user.username, hash,user.firstname,user.lastname, user.fullname,user.gender,user.address, user.birthdate, user.email, user.mobile]);
        r= results.rows[0];
    }
    catch (e)
    {
        
        console.error(e.message, e.stack);
        
    }
    finally{
        client.release();
    }  
    return r;

}
const checkUserCredential = async (username, password)=>{
    let client = await pool.connect();
    let isVerified = false;
    try
    {
        var results = await client.query('SELECT username, password FROM users WHERE LOWER(username)=LOWER($1)', [username]);
        //console.log(results.rows.length)
        if(results.rows.length> 0)
        {
            console.log(password);
            console.log(results.rows[0].password);
              let match= await  bcrypt.compare(password, results.rows[0].password);
              console.log(match);
              if(match){
                isVerified=true;
              }
              else{
                isVerified=false;
              }
        }
        else{
            isVerified=false
        }
       
    }
    catch (e)
    {
        
        console.error(e.message, e.stack);
        isVerified=false;
        
    }
    finally{
        client.release();
    }  
    
    return isVerified;
}

module.exports = {userNameExists, emailExists, createUser, checkUserCredential};
       