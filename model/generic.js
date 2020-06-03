let connection=require('../model/connection');
require('dotenv').config()
class System{

    static getgenericListing(page_count,search_key,cb){
        let pagination=process.env.ADMIN_PAGINATION;
        let skip=parseInt(page_count) * pagination;
        let sqlQuery;
        if(search_key!=''){
             sqlQuery=`SELECT generic_names.id,generic_name_translations.name FROM generic_names 
                      LEFT JOIN generic_name_translations ON generic_names.id=generic_name_translations.generic_name_id
                      WHERE generic_name_translations.language=1 AND upper(generic_name_translations.name) LIKE '%${search_key}%' ORDER BY generic_names.id DESC LIMIT ${pagination} OFFSET ${skip}`;
        }else{
            sqlQuery=`SELECT generic_names.id,generic_name_translations.name FROM generic_names 
                      LEFT JOIN generic_name_translations ON generic_names.id=generic_name_translations.generic_name_id
                      WHERE generic_name_translations.language=1 ORDER BY generic_names.id DESC LIMIT ${pagination} OFFSET ${skip}`;
        }
        
        connection.query(sqlQuery,cb);              
    }
    static getgenericListingWithoutPagination(cb){
       
        let sqlQuery=`SELECT generic_names.id,generic_name_translations.name FROM generic_names 
                      LEFT JOIN generic_name_translations ON generic_names.id=generic_name_translations.generic_name_id
                      WHERE generic_name_translations.language=1 ORDER BY generic_names.id DESC`;
        connection.query(sqlQuery,cb);              
    }
    static getGenericListingCount(search_key,cb){
        let sqlQuery;
        if(search_key!=''){
            sqlQuery=`SELECT COUNT(generic_names.id) as count FROM generic_names 
                     LEFT JOIN generic_name_translations ON generic_names.id=generic_name_translations.generic_name_id
                     WHERE generic_name_translations.language=1 AND upper(generic_name_translations.name) LIKE '%${search_key}%' ORDER BY generic_names.id DESC`;
       }else{
           sqlQuery=`SELECT COUNT(generic_names.id) as count FROM generic_names 
                     LEFT JOIN generic_name_translations ON generic_names.id=generic_name_translations.generic_name_id
                     WHERE generic_name_translations.language=1 ORDER BY generic_names.id DESC`;
       }
        connection.query(sqlQuery,cb);              
    }
    static createGeneric(name,cb){
        let create=`INSERT generic_names SET id=NULL`;
        connection.query(create,(err,result)=>{
            if(err){
                console.log(err);
            }else{
                connection.query(`INSERT generic_name_translations SET generic_name_id=? ,name=?,language=?`,[result.insertId,name,1],cb);
            }
        });
    }

    static updateGeneric(generic_id,name,cb){
        connection.query(`UPDATE generic_name_translations SET name=? WHERE generic_name_id=? AND language=?`,[name,generic_id,1],cb);
    }

    static deleteGeneric(generic_id,cb){
        connection.query(`DELETE from generic_names WHERE id=?`,[generic_id],(err,resulst)=>{
            if(err){
                console.log(err);
            }else{
                connection.query(`DELETE from generic_name_translations WHERE generic_name_id=?`,[generic_id],cb);
            }
        });
    }

}

module.exports=System;