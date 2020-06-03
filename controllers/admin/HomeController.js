let connection=require('../../model/connection');
let Helper=require('../helper/helper');
let bcrypt=require('bcrypt');
var jwt = require('jsonwebtoken');
const User = require('../../model/user');
require('dotenv').config();
exports.login = async function(req,res,next){
    let inputs=req.body;
    let email=inputs.email?inputs.email:'';
    let password=inputs.password?inputs.password:'';
    connection.query(`SELECT * FROM admins WHERE email=?`,[email],(err,result)=>{
        if(err){
            console.log(err);
        }else{
            if(result.length>0){
                    bcrypt.compare(password,result[0].password,(err,hash)=>{
                        if(err){
                            Helper.getErrorResponse(res,'Hashing Error!','hashing',err);
                        }else{
                            if(hash){
                                let token=jwt.sign(JSON.stringify(result[0]),process.env.PASSPORT_SECRET);
                                Helper.getTokenResponse(res,token,result[0]);
                            }else{
                                Helper.getErrorResponse(res,'Wrong Password!');
                            }
                        }
                    });
            }else{
                Helper.getErrorResponse(res,'User not found with this email!'); 
            }
        }
    });
}

exports.changePassword=async function(req,res,next){
    let inputs=req.body;
    connection.query('SELECT * FROM admins where id=?',[req.user.id],(err,result)=>{
        if(err){
            Helper.getErrorResponse(res,'Server Error!','db',err);
        }else{
            if(result.length>0){
                bcrypt.compare(inputs.old_password,result[0].password,(err,hash)=>{
                    if(err){
                        Helper.getErrorResponse(res,'Hashing Error!','hashing',err);
                    }else{
                        if(hash){
                            bcrypt.hash(inputs.new_password,10,(err,resultHash)=>{
                                if(err){
                                    Helper.getErrorResponse(res,'Hashing Error!');
                                }else{
                                    connection.query("UPDATE admins set password=? WHERE id=?",[resultHash,req.user.id],(err,result)=>{
                                        if(err){
                                            Helper.getErrorResponse(res,'Sever Error!','db',err);
                                        }else{
                                            Helper.getSuccessResponse(res,'Password updated!');
                                        }
                                    });
                                }
                            });
                        }else{
                            Helper.getErrorResponse(res,'Old Password is Wrong!');
                        }
                    }
                });
            }else{
                Helper.getErrorResponse(res,'User Not Found!');
            }
        }
    });
}

exports.upload = async function(req,res,next){
    console.log(req.file);
    res.status(200).json({'file_name':req.file.filename})
}

exports.dashboard = async function(req,res,next){
    let inputs=req.body;
    let query=req.query;
    let language_id=query.language_id?query.language_id:1;
    let designation_id=query.designation_id?query.designation_id:"";
    let filter=query.filter?query.filter:'';
    let date=query.date?query.date:'';
    User.getDashboardData(query,(err,result)=>{
        if(err){
            console.log(err);
            Helper.getErrorResponse(res,'Server Error!')
        }else{
            if(result.length>0){
                User.getRecentSigninUsers(filter,date,(err,signUser)=>{
                    if(err){
                        Helper.getErrorResponse(res,'Server Error!','db',err);
                    }else{
                        User.getRecentAddedMedicines(language_id,(err,medicines)=>{
                            if(err){
                                console.log(err);
                                Helper.getErrorResponse(res,'Server Error!','db',err);
                            }else{
                                User.getDashboardChartData(designation_id,(err,chart)=>{
                                    if(err){
                                        console.error(err);
                                        Helper.getErrorResponse(res,'Server Error!');
                                    }else{
                                        res.status(200).json({'counts':result[0],'recent_users':signUser,'chart':chart,'recent_medicines':medicines})
                                    }
                                });
                                
                            }
                        });
                    }
                });
            }else{
                Helper.getErrorResponse(res,'No Data Present!');
            }
        }
    });   
}