let User = require('../../model/user');
let dbQueries=require('../../config/dbqueries');
let logs = require('../../config/log');
var jwt = require('jsonwebtoken');
let bcrypt=require('bcrypt');
var exphbs  = require('express-handlebars');
var app = require('express')(),
    mailer = require('express-mailer');
    const path= require('path');
require('dotenv').config();
let Helper = require('../helper/helper');
mailer.extend(app, {
    from: 'no-reply@example.com',
    host: 'smtp.gmail.com', // hostname
    secureConnection: true, // use SSL
    port: 465, // port for secure SMTP
    transportMethod: 'SMTP', // default is SMTP. Accepts anything that nodemailer accepts
    auth: {
      user: process.env.Mail_ID,
      pass: process.env.Mail_PASS
    }
  });
require('dotenv').config();
let saltRounds=10;
let secret=process.env.PASSPORT_SECRET;
let connection=require('../../model/connection');

app.set('views',path.join(__dirname,'./../../views/'));
app.set('view engine','jade');
exports.signup = async function(req,res,next){
    let inputs=req.body;
    console.log(inputs);
    let result;
    dbQueries.query("SELECT * FROM users WHERE email=? OR apple_id=?",[inputs.email,inputs.apple_id],result,(err,result)=>{
        if(err){
            Helper.getErrorResponse(res,'Problem with query','db',err);
        }else{
            
            if(result.length>0){ //if email present in db
                User.userLogin(result[0].id,inputs);
                if(result[0].is_active==1){ //if account is deactive
                    Helper.getErrorResponse(res,'Your Account is Blocked');
                }else{
                    
                     //entering device detail in db
                    if(inputs.fb_id!='' || inputs.google_id!='' || inputs.apple_id!=''){ // if user is coming from social login
                     
                     let token=jwt.sign(JSON.stringify(result[0]),process.env.PASSPORT_SECRET);
                     delete result[0].password;
                     let is_added=1; //check for frontend devs
                     result[0].is_added=is_added;
                     
                     Helper.getTokenResponse(res,token,result[0]);
                    }else{ // if not
                     //logging in user
                     bcrypt.compare(inputs.password,result[0].password,(err,hash)=>{ //checking password
                         if(hash){
                             let token=jwt.sign(JSON.stringify(result[0]),process.env.PASSPORT_SECRET);
                             delete result[0].password;
                             let is_added=0; //check for frontend devs
                             result[0].is_added=is_added;
                            
                             Helper.getTokenResponse(res,token,result[0]);
                         }else{
                             Helper.getErrorResponse(res,'Wrong Password!');
                         }
                     });
                    }
                }
            }else{ //if email not present in db
               
                User.signup(inputs,result,(err,result)=>{
                    if(err){
                        Helper.getErrorResponse(res,'Problem with query','db',err);
                    }else{
                        result.insertId;
                        let userObject={user_id:result.insertId};
                        User.userLogin(result.insertId,inputs); // entering device details in db
                        User.getUserFromEmail(inputs.email,(err,userresult)=>{
                            if(err){
                                Helper.getErrorResponse(res,'Problem With Query!','db',err);
                            }else{
                                let token=jwt.sign(JSON.stringify(userresult[0]),process.env.PASSPORT_SECRET);
                                delete userresult[0].password;
                                let fcm_id=inputs.fcm_id?inputs.fcm_id:'';
                                let device_type=inputs.device_type?inputs.device_type:'';
                                let device_token=inputs.device_token?inputs.device_token:'';
                                let user_id=userresult[0].id?userresult[0].id:'';
                                let insertUserLoginQuery=`INSERT user_logins SET fcm_id=?,device_type=?,device_token=?,user_id=? `;
                                connection.query(insertUserLoginQuery,[fcm_id,device_type,device_token,user_id],(err,result)=>{
                                    if(err){
                                        console.log(err);
                                        logs.create('db',err);
                                    }
                                });
                                app.mailer.send('welcome', {
                                    to:inputs.email, // REQUIRED. This can be a comma delimited string just like a normal email to field. 
                                    subject: 'Welcome Email', // REQUIRED.
                                  }, function (err) {
                                    if (err) {
                                      // handle error
                                      console.log(err);
                                      Helper.getErrorResponse(res,'Mail Error!','mail',err);
                                    }else{
                                      
                                    }
                                });
                                let is_added=0; //check for frontend devs
                                userresult[0].is_added=is_added;
                                Helper.getTokenResponse(res,token,userresult[0]);
                            }
                        });
                        // Helper.getCreateResponse(res,'Record inserted!',userObject);
                    }
                });     
            }
        }
    });
}

exports.login = async function(req,res,next){
    let inputs=req.body;
    let email=inputs.email?inputs.email:'';
    let password=inputs.password?inputs.password:'';
    User.getUserFromEmail(email,(err,result)=>{
        if(err){
            console.log(err);
            Helper.getErrorResponse(res,'Problem with query','db',err);
        }else{
            if(result.length>0){
                console.log(result);
                if(result[0].is_active==1){ //if account is deactive
                    Helper.getErrorResponse(res,'Your Account is Blocked');
                }else{ //if account is active
                    bcrypt.compare(password,result[0].password,(err,hashResult)=>{
                        if(err){
                            Helper.getErrorResponse(res,'Problem with query','hashing',err);
                        }else{
                            console.log(hashResult)
                            if(hashResult){
                                let token=jwt.sign(JSON.stringify(result[0]),process.env.PASSPORT_SECRET);
                                // result[0].token=token;
                                User.userLogin(result[0].id,inputs);
                                delete result[0].password;
                                Helper.getTokenResponse(res,token,result[0]);
                                // res.status(200).json(result[0]);
                            }else{
                                Helper.getErrorResponse(res,'Password is wrong!');
                            }
                        }
                    });
                }
            }else{
                Helper.getErrorResponse(res,'Entered Email is not exist, Please try to login with Registered email');
            }
        }
    });
}

exports.addBasicinfo= async function(req,res,next){
    let inputs=req.body;
    let mobile_number=inputs.mobile_number?inputs.mobile_number:'';
    User.updateUserInfo(req,(err,result)=>{ //updating user info + adding designation in db
        if(err){
            Helper.getErrorResponse(res,'Problem with query','db',err);
        }else{
            User.getUserFromId(req.user.id,(err,result)=>{ //getting user info
                if(err){
                    Helper.getErrorResponse(res,'Problem with query','db',err);
                }else{ 
                    // let token=jwt.sign(JSON.stringify(result[0]),process.env.PASSPORT_SECRET);
                    // result[0].token=token;
                    delete result[0].password;
                    // Helper.getTokenResponse(res,token,result[0]);
                    Helper.getCreateResponse(res,'Record Updated!',result[0]);
                    // res.status(200).json(result[0]);
                }
            });
        }
    });
}

exports.forgotPassword=async function(req,res,next){
    let inputs=req.body;
    let email=inputs.email?inputs.email:'';
    let forgotPasswordLink=`http://167.71.197.68:4200/user/reset-password?token=fdsfds&email=${inputs.email}`;
    User.getUserFromEmail(email,(err,result)=>{ //getting user from email
        if(err){
            Helper.getErrorResponse(res,'Problem with query','db',err);
        }else{
            if(result.length>0){
                bcrypt.hash(email,saltRounds,(err,hash)=>{
                    if(err){
                        Helper.getErrorResponse(res,'Hashing Issue!','hash',err);
                    }else{
                        let insertQuery=`INSERT reset_password SET token=?,user_id=?`;
                        connection.query(insertQuery,[hash,result[0].id],(err,insertResult)=>{
                            if(err){
                                console.log(err);
                                Helper.getErrorResponse(res,'Problem with query','db',err);
                            }else{
                                let forgotPasswordLink=`http://167.71.197.68:4200/user/reset-password?token=${hash}&email=${inputs.email}`;
                                app.mailer.send('email', {
                                    to:result[0].email, // REQUIRED. This can be a comma delimited string just like a normal email to field. 
                                    subject: 'Forgot Password', // REQUIRED.
                                    link:forgotPasswordLink,
                                    hash: hash,// All additional properties are also passed to the template as local variables.
                                    email:result[0].email
                                }, function (err) {
                                    if (err) {
                                      // handle error
                                      console.log(err);
                                      Helper.getErrorResponse(res,'Mail Error!','mail',err);
                                    }else{
                                        Helper.getSuccessResponse(res,'Email sent Successfully');
                                    }
                                });

                            }
                        });
                    }
                });
            }else{
                Helper.getErrorResponse(res,'Entered Email is not exist, Please try to login with Registered email');  
            }
        }
    });
}

exports.resetPassword=async function(req,res,next){
    let inputs=req.body;
    let token=inputs.token?inputs.token:'';
    let email=inputs.email?inputs.email:'';
    let password=inputs.password?inputs.password:'';
    User.getUserFromEmail(email,(err,emailResult)=>{
        if(err){
            Helper.getErrorResponse(res,'Problem with query','db',err);
        }else{
            if(emailResult.length>0){
                let tokenQuery="SELECT token from reset_password WHERE user_id=? AND used=? ORDER BY id DESC";
                connection.query(tokenQuery,[emailResult[0].id,0],(err,result)=>{ //getting token from db
                    if(err){
                        Helper.getErrorResponse(res,'Problem with query','db',err);
                    }else{
                       
                        if(result.length>0 && result[0].token===token){
                            bcrypt.hash(password,saltRounds,(err,hash)=>{ // creating password hash
                                if(err){
                                    console.log('hashing',err);
                                }else{
                                    let query='UPDATE users SET password=? WHERE email=?';
                                    connection.query(query,[hash,email],(err,result)=>{ //updating password
                                        if(err){
                                            Helper.getErrorResponse(res,'Problem with query','db',err);
                                        }else{
                                            User.updateToken(emailResult[0].id);
                                            Helper.getSuccessResponse(res,'Password Updated');      
                                        }
                                    });
                                }
                            });
                        }else{
                            Helper.getErrorResponse(res,'Token invalid or expired!');
                        }
                    }
                });
            }else{
                Helper.getErrorResponse(res,'Email not present in our db!');
            }
        }
    });
}
exports.profile = async function(req,res,next){
    delete req.user.password;
   Helper.getSuccessResponse(res,'',req.user); 
}

exports.editProfile = async function(req,res,next){
    let inputs=req.body;
    User.getUserFromEmailExceptId(inputs.email,req.user.id,(err,result)=>{
        if(err){
            Helper.getErrorResponse(res,'Problem With Query!','db',err);
        }else{
            if(result.length>0){ //checking if  email is present or not
                Helper.getErrorResponse(res,'Email Already Exists!');
            }else{
                User.updateUser(req,(err,result)=>{
                    if(err){
                        Helper.getErrorResponse(res,'Problem With Query!','db',err)
                    }else{
                        Helper.getSuccessResponse(res,'Profile Updated!');
                    }
                });
            }
        }
    });
}

exports.listDesignations=async (req,res,next)=>{
    let inputs=req.body;
    let params=req.query;

    User.listDesignations(params,(err,result)=>{
        if(err){
            Helper.getErrorResponse(res,'Problem With Query!','db',err)
        }else{
            if(result.length>0){
                User.listDesignationsCount(params,(err,count)=>{
                    if(err){
                        Helper.getErrorResponse(res,'Server Error!','db',err);
                    }else{
                        Helper.getListingResponse(res,count.length,result);
                    }
                });
            }else{
                Helper.getListingResponse(res,0,[]);
            }
        }
    });
}


exports.uploadFile=async (req,res,next)=>{
    let inputs=req.body;
    if(req.file){
        console.log(req.file);
        res.status(200).json({'file_name':req.file.filename});
    }else{
        Helper.getErrorResponse(res,'Something Went Wrong!');
    }
    
};

exports.faq =async (req,res,next)=>{
    let params=req.query;
    User.faq(params,(err,result)=>{
        if(err){
            Helper.getErrorResponse(res,'Problem With Query!','db',err);
        }else{
            if(result.length>0){
                User.faqCount(params,(err,count)=>{
                    if(err){
                        Helper.getErrorResponse(res,'Server Error!','db',err);
                    }else{
                        Helper.getListingResponse(res,count.length,result);
                    }
                });
            }else{
                Helper.getListingResponse(res,0,[]);
            }
        }
    });
}


exports.postFaq=async function(req,res,next){

    let inputs=req.body;
        let name=inputs.name?inputs.name:'';
        let mobile_number=inputs.mobile_number?inputs.mobile_number:'';
        let designation_id=inputs.designation_id?inputs.designation_id:0;
        let email=inputs.email?inputs.email:'';
        let company_name=inputs.company_name?inputs.company_name:'';
        let question=inputs.question?inputs.question:'';
        let language_id=inputs.language_id?inputs.language_id:'';
        let question_description=inputs.question_description?inputs.question_description:'';
        let user_id=inputs.user_id?inputs.user_id:0;
        let insertFaq;
        let params;
        console.log('hit');
        // if(req.user){
        //     insertFaq=`INSERT ask_question SET user_id=?,designation_id=?,name=?,email=?,mobile_number=?,company_name=?`;
        //     params=[user_id,designation_id,name,email,mobile_number,company_name];
        // }else{
        //     insertFaq=`INSERT ask_question SET designation_id=?,name=?,email=?,mobile_number=?,company_name=?`;
        //     params=[designation_id,name,email,mobile_number,company_name];
        // }
        insertFaq=`INSERT ask_question SET user_id=?,designation_id=?,name=?,email=?,mobile_number=?,company_name=?`;
            params=[user_id,designation_id,name,email,mobile_number,company_name];
        connection.query(insertFaq,params,(err,result)=>{
            if(err){
                console.log(err);
            }else{
                let faq_translations=`INSERT ask_question_translations SET ask_question_id=?,language=?,question=?,question_description=?`;
                connection.query(faq_translations,[result.insertId,language_id,question,question_description],(err,result)=>{
                    if(err){
                        console.log(err);
                        Helper.getErrorResponse(res,'Server Error!','db',err);
                    }else{
                        console.log(result);
                        res.status(200).json({'message':'Question Posted!'});
                    }
                });
            }
        });
}

exports.enquiry =async (req,res,next)=>{
    let inputs=req.body;
    User.postEnquiry(req,(err,result)=>{
        if(err){
            Helper.getErrorResponse(res,'Problem With Query!','db',err);
        }else{
            Helper.getSuccessResponse(res,'Inquiry posted!');
        }
    });
}

exports.changePassword=async (req,res,next)=>{
    let inputs=req.body;
    let user_id=req.user.id?req.user.id:'';
    let old_password=inputs.old_password?inputs.old_password:'';
    let new_password=inputs.new_password?inputs.new_password:'';
    connection.query(`SELECT password from users WHERE id=${user_id}`,(err,result)=>{
        if(err){
           Helper.getErrorResponse(res,'Sever Error!','db',err);
        }else{
            bcrypt.compare(old_password,result[0].password,(err,result)=>{
                if(err){
                    Helper.getErrorResponse(res,'Hashing Error!');
                }else{
                    if(result){
                        bcrypt.hash(new_password,10,(err,result)=>{
                            if(err){
                                Helper.getErrorResponse(res,'Hashing Error!');
                            }else{
                                connection.query(`UPDATE users SET password=? WHERE id=?`,[result,user_id],(err,result)=>{
                                    if(err){
                                        Helper.getErrorResponse(res,'Server Error!','db',err);
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
        }
    });
}
exports.listQuestions=async (req,res,next)=>{
    let query=req.query;
    User.question(query,(err,result)=>{
        if(err){
            Helper.getErrorResponse(res,'Server Error!','db',err);
        }else{
            Helper.getListingResponse(res,result.length,result);
        }
    });
}
exports.logout = async (req,res,next)=>{
    let inputs=req.body;
    User.deleteUserLogin(req.user,(err,result)=>{
        if(err){
            Helper.getErrorResponse(res,'Problem With Query!','db',err);
        }else{
            Helper.getSuccessResponse(res,'You Logged out Successfully!');
        }
    });
}