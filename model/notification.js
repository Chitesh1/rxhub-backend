let connection=require('../model/connection');
require('dotenv').config();

class Notification{
    static postNotification(data,type,cb){
        let subject=data.subjects?data.subjects:'';
        let message=data.message?data.message:'';
        let cat_id=data.cat_id?data.cat_id:'';
        let sub_cat_id=data.sub_cat_id?data.sub_cat_id:'';
        let sqlQuery;
        if(type==0){ //to all users
            sqlQuery=`SELECT * FROM user_logins WHERE logged_out=0`;
        }else if(type==1){
            let ids=data.id.replace(/"/g,'');
            let idarray=ids.split(',');
                console.log(idarray.toString());
            sqlQuery=`SELECT * FROM user_logins WHERE user_id IN (${idarray}) AND logged_out=0  ORDER BY id DESC`;
        }else if(type==2){
            if(cat_id!='' && sub_cat_id!=''){ //if both set
                console.log('both set')
                sqlQuery=`SELECT user_logins.fcm_id,user_logins.device_type,user_logins.device_token,user_logins.user_id,designation_translations.designation_id FROM designation_translations
                          LEFT JOIN designation_categories ON designation_translations.designation_category_id = designation_categories.id
                          LEFT JOIN users ON designation_translations.designation_id=users.designation_id
                          LEFT JOIN user_logins ON users.id=user_logins.user_id 
                          WHERE designation_translations.language=1 AND user_logins.logged_out=0 
                          AND designation_translations.designation_id=${sub_cat_id} AND designation_categories.id=${cat_id}`;
            }else if(cat_id!=''){ //if category set
                console.log('cat set')
                sqlQuery=`SELECT user_logins.fcm_id,user_logins.device_type,user_logins.device_token,user_logins.user_id,designation_translations.designation_id FROM designation_translations
                          LEFT JOIN designation_categories ON designation_translations.designation_category_id = designation_categories.id
                          LEFT JOIN users ON designation_translations.designation_id=users.designation_id
                          LEFT JOIN user_logins ON users.id=user_logins.user_id 
                          WHERE designation_translations.language=1 AND user_logins.logged_out=0 
                          AND designation_categories.id=${cat_id}`;
            }else if(sub_cat_id!=''){ //if subcategory set
                console.log('sub cat set');
                sqlQuery=`SELECT user_logins.fcm_id,user_logins.device_type,user_logins.device_token,user_logins.user_id,designation_translations.designation_id FROM designation_translations
                          LEFT JOIN designation_categories ON designation_translations.designation_category_id = designation_categories.id
                          LEFT JOIN users ON designation_translations.designation_id=users.designation_id
                          LEFT JOIN user_logins ON users.id=user_logins.user_id 
                          WHERE designation_translations.language=1 AND user_logins.logged_out=0 
                          AND designation_translations.designation_id=${sub_cat_id}`;
            }else{
                
            }
            
        }
        else{
            return false;
        }
        connection.query(sqlQuery,cb);
    }

}

module.exports=Notification;