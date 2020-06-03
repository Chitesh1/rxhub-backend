let mysql = require("mysql");
require('dotenv').config();
let connection =mysql.createConnection({
  host: process.env.DB_HOST,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_NAME
});

connection.connect(function(err){
    if(err){
        console.error(err);
    }else{
        
    }
  
});
module.exports=connection;