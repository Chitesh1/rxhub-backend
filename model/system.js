let connection=require('../model/connection');
require('dotenv').config()
class System{

    static getSystemListing(page_count,search_key,cb){
        let pagination=process.env.ADMIN_PAGINATION;
        let skip=parseInt(page_count) * pagination;
        let sqlQuery;
        if(search_key!=''){
            sqlQuery=`SELECT med_systems.id,med_system_translations.name FROM med_systems 
                      LEFT JOIN med_system_translations ON med_systems.id=med_system_translations.med_system_id
                      WHERE med_system_translations.language=1 AND upper(med_system_translations.name) LIKE '%${search_key.toUpperCase()}%' ORDER BY med_systems.id DESC LIMIT ${pagination} OFFSET ${skip}`;
        }else{
            sqlQuery=`SELECT med_systems.id,med_system_translations.name FROM med_systems 
                      LEFT JOIN med_system_translations ON med_systems.id=med_system_translations.med_system_id
                      WHERE med_system_translations.language=1  ORDER BY med_systems.id DESC LIMIT ${pagination} OFFSET ${skip}`;
        }
        
        connection.query(sqlQuery,cb);              
    }

    static getSystemListingCount(search_key,cb){
        let sqlQuery;
        if(search_key!=''){
            sqlQuery=`SELECT COUNT(med_systems.id) as count FROM med_systems 
                      LEFT JOIN med_system_translations ON med_systems.id=med_system_translations.med_system_id
                      WHERE med_system_translations.language=1 AND upper(med_system_translations.name) LIKE '%${search_key.toUpperCase()}%' ORDER BY med_systems.id DESC`;
        }else{
            sqlQuery=`SELECT COUNT(med_systems.id) as count FROM med_systems 
                      LEFT JOIN med_system_translations ON med_systems.id=med_system_translations.med_system_id
                      WHERE med_system_translations.language=1 ORDER BY med_systems.id DESC`;
        }
        connection.query(sqlQuery,cb);              
    }
    static getSystemListingWithoutPagination(cb){
        
        let sqlQuery=`SELECT med_systems.id,med_system_translations.name FROM med_systems 
                      LEFT JOIN med_system_translations ON med_systems.id=med_system_translations.med_system_id
                      WHERE med_system_translations.language=1 ORDER BY med_systems.id DESC`;
        connection.query(sqlQuery,cb);              
    }
    static createDrugSystem(name,cb){
        let create=`INSERT med_systems SET id=NULL`;
        connection.query(create,(err,result)=>{
            if(err){
                console.log(err);
            }else{
                connection.query(`INSERT med_system_translations SET med_system_id=? ,name=?,language=?`,[result.insertId,name,1],cb);
            }
        });
    }

    static updateDrugSystem(system_id,name,cb){
        connection.query(`UPDATE med_system_translations SET name=? WHERE med_system_id=? AND language=?`,[name,system_id,1],cb);
    }

    static deleteDrugSystem(system_id,cb){
        connection.query(`DELETE from med_systems WHERE id=?`,[system_id],(err,resulst)=>{
            if(err){
                console.log(err);
            }else{
                connection.query(`DELETE from med_system_translations WHERE med_system_id=?`,[system_id],cb);
            }
        });
    }

}

module.exports=System;