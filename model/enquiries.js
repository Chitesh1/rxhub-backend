let connection=require('../model/connection');
require('dotenv').config();
class Enquiry{

    static getEnquiryList(page_count,search_key,cb){
        let pagination=process.env.ADMIN_PAGINATION;
        let skip=parseInt(page_count) * pagination;
        let sqlQuery
        if(search_key!=''){
            sqlQuery=`SELECT id,name,email,message,mobile_number FROM inquiries WHERE upper(name) LIKE '%${search_key.toUpperCase()}%' OR 
            upper(email) LIKE '%${search_key.toUpperCase()}%' OR upper(message) LIKE '%${search_key.toUpperCase()}%' OR 
            upper(mobile_number) LIKE '%${search_key.toUpperCase()}%'  ORDER BY id DESC LIMIT ${pagination} OFFSET ${skip}`;
        }else{
            sqlQuery=`SELECT id,name,email,message,mobile_number FROM inquiries ORDER BY id DESC LIMIT ${pagination} OFFSET ${skip}`;
        }
        
        connection.query(sqlQuery,cb);            
    }

    static getEnquiryListCount(search_key,cb){
       
        let sqlQuery
        if(search_key!=''){
            sqlQuery=`SELECT COUNT(id) as count FROM inquiries WHERE upper(name) LIKE '%${search_key.toUpperCase()}%' OR 
            upper(email) LIKE '%${search_key.toUpperCase()}%' OR upper(message) LIKE '%${search_key.toUpperCase()}%' OR 
            upper(mobile_number) LIKE '%${search_key.toUpperCase()}%'`;
        }else{
            sqlQuery=`SELECT COUNT(id) as count FROM inquiries`;
        }
        
        connection.query(sqlQuery,cb);            
    }

    static deleteEnquiry(enquiry_id,cb){
       
        connection.query(`DELETE FROM inquiries WHERE id=${enquiry_id}`,cb);
      
    }

    static replyEnquiry(inputs,cb){
        let enquiry_id=inputs.enquiry_id?inputs.enquiry_id:'';
        let email=inputs.email?inputs.email:'';
        let subject=inputs.subject?inputs.subject:'';
        let body=inputs.body?inputs.body:'';
        let query=`INSERT inquiry_reply SET enquiry_id=?,email=?,subject=?,body=?`;
        connection.query(query,[enquiry_id,email,subject,body],cb);
    }


}

module.exports=Enquiry;