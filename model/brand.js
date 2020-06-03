let connection=require('../model/connection');
require('dotenv').config()
class System{

    static getBrandListing(page_count,search_key,cb){
        let pagination=process.env.ADMIN_PAGINATION;
        let skip=parseInt(page_count) * pagination;
        let sqlQuery;
        if(search_key!=''){
            sqlQuery=`SELECT brands.id,brand_translations.name FROM brands 
                      LEFT JOIN brand_translations ON brands.id=brand_translations.brand_id
                      WHERE brand_translations.language=1 AND upper(brand_translations.name) LIKE '%${search_key.toUpperCase()}%' ORDER BY brands.id DESC LIMIT ${pagination} OFFSET ${skip}`;
        }else{
            sqlQuery=`SELECT brands.id,brand_translations.name FROM brands 
                      LEFT JOIN brand_translations ON brands.id=brand_translations.brand_id
                      WHERE brand_translations.language=1 ORDER BY brands.id DESC LIMIT ${pagination} OFFSET ${skip}`;
        }
        
        connection.query(sqlQuery,cb);              
    }

    static getBrandListingWithoutPagination(cb){
       
        let sqlQuery;
       
            sqlQuery=`SELECT brands.id,brand_translations.name FROM brands 
                      LEFT JOIN brand_translations ON brands.id=brand_translations.brand_id
                      WHERE brand_translations.language=1 ORDER BY brands.id DESC`;
        
        
        connection.query(sqlQuery,cb);              
    }

    static getBrandListingCount(search_key,cb){
        let sqlQuery;
        if(search_key!=''){
            sqlQuery=`SELECT COUNT(brands.id) as count FROM brands 
                      LEFT JOIN brand_translations ON brands.id=brand_translations.brand_id
                      WHERE brand_translations.language=1 AND upper(brand_translations.name) LIKE '%${search_key.toUpperCase()}%'`;
        }else{
            sqlQuery=`SELECT COUNT(brands.id) as count FROM brands 
                      LEFT JOIN brand_translations ON brands.id=brand_translations.brand_id
                      WHERE brand_translations.language=1 ORDER BY brands.id DESC`;
        }
        connection.query(sqlQuery,cb);              
    }
    static createBrand(name,cb){
        let create=`INSERT brands SET id=NULL`;
        connection.query(create,(err,result)=>{
            if(err){
                console.log(err);
            }else{
                connection.query(`INSERT brand_translations SET brand_id=? ,name=?,language=?`,[result.insertId,name,1],cb);
            }
        });
    }

    static updateBrand(brand_id,name,cb){
        connection.query(`UPDATE brand_translations SET name=? WHERE brand_id=? AND language=?`,[name,brand_id,1],cb);
    }

    static deleteBrand(brand_id,cb){
        connection.query(`DELETE from brands WHERE id=?`,[brand_id],(err,resulst)=>{
            if(err){
                console.log(err);
            }else{
                connection.query(`DELETE from brand_translations WHERE brand_id=?`,[brand_id],cb);
            }
        });
    }

}

module.exports=System;