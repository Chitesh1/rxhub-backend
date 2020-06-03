let dbQueries = require('../config/dbqueries');
let connection=require('../model/connection');
let bcrypt = require('bcrypt');
let logs = require('../config/log');
require('dotenv').config();
let saltRounds=10;
let Helper=require('../controllers/helper/helper');

class User{
    static signup(inputs,result,cb){
        let image=inputs.image?inputs.image:'';
        let name=inputs.name?inputs.name:'';
        let email=inputs.email?inputs.email:'';
        let password=inputs.password?inputs.password:'';
        let apple_id=inputs.apple_id?inputs.apple_id:'';
        let fb_id=inputs.fb_id?inputs.fb_id:'';
        let google_id=inputs.google_id?inputs.google_id:'';
        bcrypt.hash(password,saltRounds,(err,hash)=>{
            console.log(hash);
            if(err){
                console.log(err);
            }else{
                let query="INSERT users SET profile_pic=?,name=?,email=?,password=?,apple_id=?,fb_id=?,google_id=?";
                connection.query(query,[image,name,email,hash,apple_id,fb_id,google_id],cb); //inserting data
            }
        });
        
    }

    static updateUserLoginInfo(inputs,user_id,cb){
        let image=inputs.image?inputs.image:'';
        let name=inputs.name?inputs.name:'';
        let email=inputs.email?inputs.email:'';
        let password=inputs.password?inputs.password:'';
        let apple_id=inputs.apple_id?inputs.apple_id:'';
        let fb_id=inputs.fb_id?inputs.fb_id:'';
        let google_id=inputs.google_id?inputs.google_id:'';
        let query="UPDATE users SET profile_pic=?,name=?,email=?,apple_id=?,fb_id=?,google_id=?, WHERE user_id=?";
         connection.query(query,[image,name,email,apple_id,fb_id,google_id,0,user_id],cb); //inserting data

    }

    static updateUserInfo(req,cb){
        let inputs=req.body;
        console.log(inputs);
        let mobile_number=inputs.mobile_number?inputs.mobile_number:'';
        let age=inputs.age?inputs.age:'';
        let gender=inputs.gender?inputs.gender:'';
        let designation_id=inputs.designation_id?inputs.designation_id:'';
        let language=inputs.language?inputs.language:'';
        let company_name=inputs.company_name?inputs.company_name:'';
        let country_code=inputs.country_code?inputs.country_code:'';
        let user_id=req.user.id?req.user.id:'';
        let is_notification_enable=inputs.is_notification_enable?inputs.is_notification_enable:'';
        let fcm_id=inputs.fcm_id?inputs.fcm_id:'';
        let device_type=inputs.device_type?inputs.device_type:'';
        let device_token=inputs.device_token?inputs.device_token:'';
        // console.log(inputs);
        // let insertUserLoginQuery=`INSERT user_logins SET fcm_id=?,device_type=?,device_token=?,user_id=? `;
        // connection.query(insertUserLoginQuery,[fcm_id,device_type,device_token,user_id],(err,result)=>{
        //     if(err){
        //         console.log(err);
        //         logs.create('db',err);
        //     }
        // });
        let updateUserQuery='UPDATE users SET phone_no=?,age=?,gender=?,designation_id=?,company_name=?,country_code=? WHERE id=?';
        connection.query(updateUserQuery,[mobile_number,age,gender,designation_id,company_name,country_code,user_id],cb);//updating user
    }
    static getUserFromId(user_id,cb){
        let query='SELECT * FROM users WHERE id=?';
        connection.query(query,[user_id],cb);
    }

    static getUserFromEmail(email,cb){
        let query='SELECT * FROM users WHERE email=?';
        connection.query(query,[email],cb);
    }

    static getUserFromNumber(mobile_number,cb){
        let query='SELECT * FROM users WHERE phone_no=?';
        connection.query(query,[mobile_number],cb);
    }

    static userLogin(user_id,inputs){
        let fcm_id=inputs.fcm_id?inputs.fcm_id:'';
        let device_type=inputs.device_type?inputs.device_type:'';
        let device_token=inputs.device_token?inputs.device_token:'';
        let findQuery;
        let param;
        if(device_type==0){
             findQuery=`DELETE FROM user_logins WHERE fcm_id=?`;
                param=[fcm_id];
        }else if(device_type==1){
             findQuery=`DELETE FROM user_logins WHERE device_token=?`;
             param=[device_token]
        }
        
        connection.query(findQuery,param,(err,user)=>{
            if(err){
                console.log(err);
            }else{
                console.log(user);
                // if(user.length>0){
                    
                //     let insertUserLoginQuery=`UPDATE user_logins SET fcm_id=?,device_type=?,device_token=?,user_id=?,logged_out=? WHERE id=? `;
                //     connection.query(insertUserLoginQuery,[fcm_id,device_type,device_token,user_id,0,user[0].id],(err,result)=>{
                //         if(err){
                //             console.log(err);
                //             logs.create('db',err);
                //         }
                //     });
                // }else{
                    let insertUserLoginQuery=`INSERT user_logins SET fcm_id=?,device_type=?,device_token=?,user_id=? `;
                    connection.query(insertUserLoginQuery,[fcm_id,device_type,device_token,user_id],(err,result)=>{
                        if(err){
                            console.log(err);
                            logs.create('db',err);
                        }
                    });
                // }
            }
        });
    }

    static forgotPassword(email,cb){
       let query=`INSERT reset_password token=?`;
       bcrypt.hash(email,saltRounds,(err,hash)=>{
           if(err){
               logs.create('hashing',err);
           }else{
               connection.query(query,[hash],cb)
           }
       });
    }

    static updateToken(user_id){
        let query=`UPDATE reset_password SET used=? WHERE user_id=?`;
        connection.query(query,[1,user_id],(err,result)=>{
            if(err){
                console.log(err);
                logs.create('db',err);
            }
        });
    }

    static listDesignations(data,cb){
        let language_id=data.language_id?data.language_id:'';
        let pagination=process.env.PAGINATION;
        let page_count=data.page_count?data.page_count:0;
        let skip=parseInt(page_count) * pagination;
        let query=`SELECT designations.id ,designation_translations.name from designations LEFT JOIN  designation_translations ON designations.id=designation_translations.designation_id WHERE designation_translations.language = ? LIMIT ${pagination} OFFSET ${skip}`
        connection.query(query,[language_id],cb);
    }

    static listDesignationsCount(data,cb){
        let language_id=data.language_id?data.language_id:'';
        let query=`SELECT designations.id ,designation_translations.name from designations LEFT JOIN  designation_translations ON designations.id=designation_translations.designation_id WHERE designation_translations.language = ?`
        connection.query(query,[language_id],cb);
    }

    static updateUser(req,cb){
        let inputs=req.body;
       
        let file_name=inputs.profile_pic?inputs.profile_pic:'';
        let user_id=req.user.id?req.user.id:'';
        let name=inputs.name?inputs.name:'';
        let email=inputs.email?inputs.email:'';
        let mobile_number=inputs.mobile_number?inputs.mobile_number:'';
        let country_code=inputs.country_code?inputs.country_code:'';
        let age=inputs.age?inputs.age:'';
        let gender=inputs.gender?inputs.gender:'';
        let designation_id=inputs.designation_id?inputs.designation_id:'';
        let company_name=inputs.company_name?inputs.company_name:'';
        
        let updateQuery='';
        let params=[];
        console.log(inputs.is_notification_enable);
        if(inputs.is_notification_enable && inputs.is_notification_enable!=''){ //notification updation
            updateQuery=`Update users SET is_notification_enable=? WHERE id=?`;
                params=[inputs.is_notification_enable,user_id];
        }else{
            if(email==''){ // if email is not set aur empty
                updateQuery=`Update users SET name=?,phone_no=?,country_code=?,age=?,gender=?,designation_id=?,company_name=? WHERE id=?`;
                params=[name,mobile_number,country_code,age,gender,designation_id,company_name,user_id];
            }else{ //if email is set 
                if(file_name==''){
                    updateQuery=`Update users SET name=?,email=?,phone_no=?,country_code=?,age=?,gender=?,designation_id=?,company_name=? WHERE id=?`;
                    params=[name,email,mobile_number,country_code,age,gender,designation_id,company_name,user_id];
                }else{
                    updateQuery=`Update users SET name=?,email=?,profile_pic=?,phone_no=?,country_code=?,age=?,gender=?,designation_id=?,company_name=? WHERE id=?`;
                    params=[name,email,file_name,mobile_number,country_code,age,gender,designation_id,company_name,user_id];
                }
            }
        }
        
        connection.query(updateQuery,params,cb);
    }
    static getUserFromEmailExceptId(email,user_id,cb){
        let query='SELECT * FROM users WHERE email=? AND NOT id=?';
        connection.query(query,[email,user_id],cb);
    }

    static deleteUserLogin(data,cb){
        let deleteQuery=`UPDATE user_logins SET logged_out=? WHERE user_id=?`;
        connection.query(deleteQuery,[1,data.id],cb);
    }

    static faq(data,cb){
        let pagination=process.env.PAGINATION;
        let page_count=data.page_count?data.page_count:0;
        let skip=parseInt(page_count) * pagination;
        let language_id=data.language_id?data.language_id:1;
        let query=`SELECT faqs.id,faq_translations.question,faq_translations.answer from faqs
                   LEFT JOIN  faq_translations ON faqs.id = faq_translations.faq_id 
                   WHERE language=${language_id} LIMIT ${pagination} OFFSET ${skip}`;
                   console.log(query);
        connection.query(query,cb);           
    }

    static faqCount(data,cb){
      
        let language_id=data.language_id?data.language_id:1;
        let query=`SELECT faqs.id,faq_translations.question,faq_translations.answer from faqs
                   LEFT JOIN  faq_translations ON faqs.id = faq_translations.faq_id 
                   WHERE language=${language_id}`;
                   console.log(query);
        connection.query(query,cb); 
    }

    static question(data,cb){
        let language_id=data.language_id?data.language_id:1;
        let query=`SELECT faqs.id,faq_translations.question from faqs
                   LEFT JOIN  faq_translations ON faqs.id = faq_translations.faq_id 
                   WHERE language=${language_id}`;
                   console.log(query);
        connection.query(query,cb);           
    }    
    static postEnquiry(data,cb){
        console.log(data.user);
        let inputs=data.body;
        let name=inputs.name?inputs.name:'';
        let email=inputs.email?inputs.email:'';
        let message=inputs.message?inputs.message:'';
        let mobile_number=inputs.mobile_number?inputs.mobile_number:'';
        let user_id=data.user.id?data.user.id:0;
        let query=`INSERT inquiries SET user_id=? ,name=?,email=?,message=?,mobile_number=?`;

        connection.query(query,[user_id,name,email,message,mobile_number],cb);
    }

    static changePassword(req,cb){
        connection.query(`SELECT password from users WHERE id=${user_id}`,(err,result)=>{
            if(err){
               Helper.getErrorResponse(res,'Sever Error!','db',err);
            }else{
                bcrypt.compare(inputs.password,result[0].password,(err,result)=>{
                    if(err){
                        Helper.getErrorResponse(res,'Hashing Error!');
                    }else{
                        if(result){
                            bcrypt.hash(inputs.new_password,10,(err,result)=>{
                                if(err){
                                    Helper.getErrorResponse(res,'Hashing Error!');
                                }else{
                                    connection.query(`UPDATE SET password=${result}`,(err,result)=>{
                                        
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
    //ADMIN

    static getDashboardData(data,cb){

        let sqlQuery=`SELECT (SELECT COUNT(users.id) FROM users) as users,
                      (SELECT COUNT(medicines.id) FROM medicines) as medicine,
                      (SELECT COUNT(id) FROM generic_names) as generic,
                      (SELECT COUNT(id) FROM category) as category,
                      (SELECT COUNT(id) FROM med_systems) as systems,
                      (SELECT COUNT(id) FROM brands) as brand,
                      (SELECT COUNT(id) FROM diseases) as disease,
                      (SELECT COUNT(id) FROM body_parts) as body_parts,
                      (SELECT COUNT(id) FROM designations) as designations,
                      (SELECT COUNT(id) FROM inquiries) as inquiries`;
        connection.query(sqlQuery,cb);
    }

    static getDashboardChartData(designation,cb){
        let sqlQuery;
        if(designation!=''){
            sqlQuery=`SELECT COUNT(disease_translations.name) as count,disease_translations.name FROM consumptions 
            LEFT JOIN medicines ON consumptions.medicine_id=medicines.id
            LEFT JOIN disease_translations ON medicines.disease_id=disease_translations.disease_id
            WHERE disease_translations.language=1 AND medicines.designation_id=${designation} GROUP BY disease_translations.name`;
        }else{
            sqlQuery=`SELECT COUNT(disease_translations.name) as count,disease_translations.name FROM consumptions 
                      LEFT JOIN medicines ON consumptions.medicine_id=medicines.id
                      LEFT JOIN disease_translations ON medicines.disease_id=disease_translations.disease_id
                      WHERE disease_translations.language=1 GROUP BY disease_translations.name`;
        }

        connection.query(sqlQuery,cb);
    }

    static getRecentSigninUsers(filter=null,date,cb){
        let sqlQuery;
        if(date!=''){
            sqlQuery=`SELECT users.name,users.created_at FROM users WHERE users.created_at LIKE '%${date}%' ORDER BY users.created_at DESC LIMIT 20`;
            
        }else{
            if(filter==0){
                var date= new Date();
                let month = date.getMonth()+1;
                sqlQuery=`SELECT users.name,users.created_at FROM users WHERE MONTH(created_at) = ${month} ORDER BY users.created_at DESC LIMIT 20`;
            }else if(filter==1){
                var date = new Date();
                let year = date.getFullYear();
                sqlQuery=`SELECT users.name,users.created_at FROM users WHERE YEAR(created_at) = ${year} ORDER BY users.created_at DESC LIMIT 20`;
            }else if(filter==2){
                sqlQuery=`SELECT users.name,users.created_at FROM users ORDER BY users.created_at DESC LIMIT 20`;
            }else{
                sqlQuery=`SELECT users.name,users.created_at FROM users ORDER BY users.created_at DESC LIMIT 20`;
            }
        }
        connection.query(sqlQuery,cb);
    }

    static getRecentAddedMedicines(language_id,cb){
        let SqlQuery=`SELECT  medicine_translations.name,medicines.created_at FROM medicines 
                      LEFT JOIN medicine_translations ON medicines.id = medicine_translations.medicine_id
                      WHERE medicine_translations.language= ${language_id} ORDER BY medicines.created_at DESC LIMIT 20`;
        connection.query(SqlQuery,cb);
    }

    static userListing(query,cb){
        let page_count=query.page_count?query.page_count:0;
        
        let pagination=process.env.ADMIN_PAGINATION;
        let skip=parseInt(page_count)*pagination;
        let language_id=query.language_id?query.language_id:1;
        let search_key=query.search_key?query.search_key:'';
        console.log(pagination,skip);
        let sqlQuery;
        if(search_key!=''){
            sqlQuery=`SELECT users.name,users.profile_pic,users.email,users.phone_no,users.id,
                      users.country_code,users.designation_id,(SELECT name FROM designation_translations WHERE designation_id=users.designation_id AND language=1) as designation_name FROM users
                      WHERE upper(users.email) LIKE '%${search_key.toUpperCase()}%' 
                      OR upper(users.name) LIKE '%${search_key.toUpperCase()}%' OR  users.phone_no LIKE '%${search_key}%'  ORDER BY users.created_at DESC LIMIT ${pagination} OFFSET ${skip}`;
        }else{
            sqlQuery=`SELECT users.name,users.id,users.profile_pic,users.email,users.phone_no,users.country_code,(SELECT name FROM designation_translations WHERE designation_id=users.designation_id AND language=1) as designation_name FROM users ORDER BY users.created_at DESC LIMIT ${pagination} OFFSET ${skip}`;
        }
        console.log(sqlQuery);
        connection.query(sqlQuery,cb);
    }
    static userDesignation(designation_id,cb){
       
        let sqlQuery=`SELECT designation_translations.name as designation_name FROM designation_translations WHERE designation_id=${designation_id} AND language=1`;
        connection.query(sqlQuery,cb);
    }
    static userListingAll(cb){
      let  sqlQuery=`SELECT users.name,users.id,users.profile_pic,users.email,users.phone_no,users.country_code FROM users`;
        connection.query(sqlQuery,cb);              
    }

    static userListingCount(query,cb){
        let page_count=query.page_count?query.page_count:0;
        
        let pagination=process.env.ADMIN_PAGINATION;
        let skip=parseInt(page_count)*pagination;
        let language_id=query.language_id?query.language_id:1;
        let search_key=query.search_key?query.search_key:'';
        let sqlQuery;
        if(search_key!=''){
            sqlQuery=`SELECT COUNT(users.id) as count FROM users
                      WHERE upper(users.email) LIKE '%${search_key.toUpperCase()}%' 
                      OR upper(users.name) LIKE '%${search_key.toUpperCase()}%' OR  users.phone_no LIKE '%${search_key}%'`;
        }else{
            sqlQuery=`SELECT COUNT(users.id) as count FROM users `;
        }
        connection.query(sqlQuery,cb);
    }

    static userDetail(query,language_id,cb){
        let user_id=query.id?query.id:'';
        let sqlQuery=`SELECT users.id,users.country_code,users.name,users.profile_pic,users.email,users.company_name,users.is_active,
                        users.phone_no,users.age,users.gender,(SELECT name FROM designation_translations WHERE designation_id=users.designation_id AND language=1) as designation_name,
                        users.created_at as signup_date,user_logins.created_at as last_login FROM users  
                      LEFT JOIN user_logins ON users.id = user_logins.user_id
                      WHERE users.id= ${user_id} ORDER BY user_logins.created_at DESC LIMIT 1`;
        connection.query(sqlQuery,cb);              
    }

    static getRecentlyBrowsedMedicines(page_count,user_id,language_id,cb){
        let pagination=process.env.ADMIN_PAGINATION;
        let skip=parseInt(page_count) * pagination;
        let sqlQuery=`SELECT medicine_translations.name,medicine_translations.medicine_id,medicines.created_at,disease_translations.name as indication FROM searched_medicines 
                    LEFT JOIN medicines ON searched_medicines.medicine_id=medicines.id
                    LEFT JOIN medicine_translations ON searched_medicines.medicine_id=medicine_translations.medicine_id
                    LEFT JOIN disease_translations ON medicines.disease_id=disease_translations.disease_id 
                    WHERE searched_medicines.user_id=${user_id} AND medicine_translations.language=1 AND disease_translations.language=${language_id}
                    ORDER BY searched_medicines.created_at DESC LIMIT ${pagination} OFFSET ${skip}`;
        connection.query(sqlQuery,cb);            
    }

    static getRecentlyBrowsedMedicinesCount(user_id,language_id,cb){
        let sqlQuery=`SELECT COUNT(searched_medicines.id) as count FROM searched_medicines 
                    LEFT JOIN medicines ON searched_medicines.medicine_id=medicines.id
                    LEFT JOIN medicine_translations ON searched_medicines.medicine_id=medicine_translations.medicine_id
                    LEFT JOIN disease_translations ON medicines.disease_id=disease_translations.disease_id 
                    WHERE searched_medicines.user_id=${user_id} AND medicine_translations.language=1 AND disease_translations.language=${language_id}
                    ORDER BY searched_medicines.created_at DESC`;
        connection.query(sqlQuery,cb);            
    }

    static getUserInquiries(user_id,cb){
        let sqlQuery=`SELECT inquiries.* FROM inquiries WHERE user_id=${user_id}`;
        connection.query(sqlQuery,cb);
    }

    static getAskedQuestions(user_id,language_id,cb){
        let sqlQuery=`SELECT ask_question.*,ask_question_translations.question,ask_question_translations.question_description FROM ask_question 
        LEFT JOIN ask_question_translations ON ask_question.id=ask_question_translations.ask_question_id
        WHERE ask_question.user_id=${user_id} AND ask_question_translations.language=${language_id}`;
        connection.query(sqlQuery,cb)
    }

    static updateUserStatus(user_id,status,cb){
        let sqlQuery=`UPDATE users SET is_active=? WHERE id=?`;
        connection.query(sqlQuery,[status,user_id],cb);
    }
}

module.exports=User;