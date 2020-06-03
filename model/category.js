let connection=require('../model/connection');
require('dotenv').config()
class Category{

    static getCategoryListing(page_count,search_key,cb){
        let pagination=process.env.ADMIN_PAGINATION;
        let skip=parseInt(page_count) * pagination;
        let sqlQuery;
        if(search_key!=''){
            sqlQuery=`SELECT category.id,category_translations.name FROM category 
                      LEFT JOIN category_translations ON category.id=category_translations.category_id
                      WHERE category_translations.language=1 AND upper(category_translations.name) LIKE '%${search_key.toUpperCase()}%' ORDER BY category.id DESC LIMIT ${pagination} OFFSET ${skip}`;
        }else{
            sqlQuery=`SELECT category.id,category_translations.name FROM category 
                      LEFT JOIN category_translations ON category.id=category_translations.category_id
                      WHERE category_translations.language=1 ORDER BY category.id DESC LIMIT ${pagination} OFFSET ${skip}`;
        }
        
        connection.query(sqlQuery,cb);              
    }

    static getCategoryListingWithoutPagination(cb){
       let  sqlQuery=`SELECT category.id,category_translations.name FROM category 
                      LEFT JOIN category_translations ON category.id=category_translations.category_id
                      WHERE category_translations.language=1 ORDER BY category.id DESC`;
                      connection.query(sqlQuery,cb);    
    }
    static getCategoryListingCount(search_key,cb){
        let sqlQuery;
        if(search_key!=''){
            sqlQuery=`SELECT COUNT(category.id) as count FROM category 
                      LEFT JOIN category_translations ON category.id=category_translations.category_id
                      WHERE category_translations.language=1 AND upper(category_translations.name) LIKE '%${search_key.toUpperCase()}%'`;
        }else{
            sqlQuery=`SELECT COUNT(category.id) as count FROM category 
                      LEFT JOIN category_translations ON category.id=category_translations.category_id
                      WHERE category_translations.language=1`;
        }
        connection.query(sqlQuery,cb);              
    }

    static getClassificationListing(cb){
        let sqlQuery=`SELECT classification.id,classification_translations.name FROM classification 
        LEFT JOIN classification_translations ON classification.id=classification_translations.classification_id
        WHERE classification_translations.language=1 ORDER BY classification.id DESC`;
        connection.query(sqlQuery,cb);   
    }
    static createCategory(name,cb){
        let create=`INSERT category SET id=NULL`;
        connection.query(create,(err,result)=>{
            if(err){
                console.log(err);
            }else{
                connection.query(`INSERT category_translations SET category_id=? ,name=?,language=?`,[result.insertId,name,1],cb);
            }
        });
    }

    static updateCategory(category_id,name,cb){
        connection.query(`UPDATE category_translations SET name=? WHERE category_id=? AND language=?`,[name,category_id,1],cb);
    }

    static deleteCategory(category_id,cb){
        connection.query(`DELETE from category WHERE id=?`,[category_id],(err,resulst)=>{
            if(err){
                console.log(err);
            }else{
                connection.query(`DELETE from category_translations WHERE category_id=?`,[category_id],cb);
            }
        });
    }

}

module.exports=Category;