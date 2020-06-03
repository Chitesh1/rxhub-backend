let connection=require('../model/connection');
require('dotenv').config();
class DesignationCategory{

    static getDesignationCatList(page_count,search_key,cb){
        let pagination=process.env.ADMIN_PAGINATION;
        let skip=parseInt(page_count) * pagination;
        let sqlQuery;
        if(search_key!=''){
            sqlQuery=`SELECT id,name FROM designation_categories WHERE upper(name) LIKE '%${search_key}%' ORDER BY id DESC LIMIT ${pagination} OFFSET ${skip}`;
        }else{
            sqlQuery=`SELECT id,name FROM designation_categories ORDER BY id DESC LIMIT ${pagination} OFFSET ${skip}`;
        }
        
        connection.query(sqlQuery,cb);            
    }

    static getDesignationCatListCount(search_key,cb){
        let sqlQuery;
        if(search_key!=''){
            sqlQuery=`SELECT COUNT(id) as count FROM designation_categories WHERE upper(name) LIKE '%${search_key}%'`;
        }else{
            sqlQuery=`SELECT COUNT(id) as count FROM designation_categories ORDER BY id DESC`;
        }
        connection.query(sqlQuery,cb);
    }

    static editCategory(cat_id,name,cb){
        let sqlQuery=`UPDATE designation_categories SET name=? WHERE id=?`;
        connection.query(sqlQuery,[name,cat_id],cb);
    }

    static addCategory(inputs,cb){
        let name=inputs.name?inputs.name:'';
        let disease=`INSERT designation_categories SET name=?`;
        // let disease_translations=`INSERT disease_translations SET disease_id=?,language=?,name=?`;s
        connection.query(disease,[name],cb);
    }

    static deleteCategories(cat_id,cb){
        let sqlQuery=`DELETE FROM designation_categories WHERE id=${cat_id}`;
        connection.query(sqlQuery,cb);
    }


}

module.exports=DesignationCategory;