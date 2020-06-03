let connection=require('../model/connection');
let log = require('./log');
exports.query = function (sql, params, ret = "result", callback) {
    connection.query(sql, params, (err, result)=> {
        if(err){
            console.log("MySql Sql Error: ", err);
            log.create("db", err);
        }else{
             //console.log("Mysql Result: ", result);
        if (callback !== null) {
            switch (ret) {
                case "result":
                    callback(err, result);
                    break;
                case "row":
                    callback(err, result && result[0] ? result[0] : null);
                    break;
                case "id":
                    callback(err, result && result.insertId ? result.insertId : null);
                    break;
                case "affected":
                    callback(err, result && result.affectedRows ? result.affectedRows : 0);
                    break;
                case "count":
                    callback(err, result && result[0] && result[0].n ? result[0].n : 0);
                    break;
                case "pluck":
                    var pluck = [];
                    result.map(function(x){
                        pluck.push(x.x);
                    });
                    callback(err, pluck);
                    break;
            }
        }
        }
    });
};