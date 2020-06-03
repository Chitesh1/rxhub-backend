let connection=require('../model/connection');
require('dotenv').config();
class Designation{

    static getDesignationList(cat_id,page_count,search_key,cb){
        let pagination=process.env.ADMIN_PAGINATION;
        let skip=parseInt(page_count) * pagination;
        console.log(cat_id);
        let sqlQuery
        if(search_key!=''){
            sqlQuery=`SELECT designations.id,designation_translations.name,designation_translations.designation_category_id  FROM designations
                      LEFT JOIN designation_translations ON designations.id=designation_translations.designation_id
                      WHERE designation_translations.language=1 AND designation_translations.designation_category_id=${cat_id} AND upper(designation_translations.name) LIKE '%${search_key.toUpperCase()}%' ORDER BY designations.id DESC LIMIT ${pagination} OFFSET ${skip}`;
        }else{
            sqlQuery=`SELECT designations.id,designation_translations.name,designation_translations.designation_category_id  FROM designations
                      LEFT JOIN designation_translations ON designations.id=designation_translations.designation_id
                      WHERE designation_translations.language=1 AND designation_translations.designation_category_id=${cat_id} ORDER BY designations.id DESC LIMIT ${pagination} OFFSET ${skip}`;
        }
        
        connection.query(sqlQuery,cb);            
    }



    static getDesignationListing(page_count,cb){
        let sqlQuery=`SELECT designations.id,designation_translations.name,designation_translations.designation_category_id  FROM designations
                      LEFT JOIN designation_translations ON designations.id=designation_translations.designation_id
                      WHERE designation_translations.language=1  ORDER BY designations.id DESC`;
        connection.query(sqlQuery,cb); 
    }

    static getDesignationListWithoutPagination(cb){
        
        let sqlQuery=`SELECT designations.id,designation_translations.name,designation_translations.designation_category_id  FROM designations
                      LEFT JOIN designation_translations ON designations.id=designation_translations.designation_id
                      WHERE designation_translations.language=1 ORDER BY designations.id DESC`;
        connection.query(sqlQuery,cb);            
    }

    static getDesignationCount(cat_id,search_key,cb){
        let sqlQuery;
        if(search_key!=''){
            sqlQuery=`SELECT COUNT(designations.id) as count FROM designations
                      LEFT JOIN designation_translations ON designations.id=designation_translations.designation_id
                      WHERE designation_translations.language=1 AND designation_translations.designation_category_id=${cat_id} AND upper(designation_translations.name) LIKE '%${search_key.toUpperCase()}%'`;
        }else{
            sqlQuery=`SELECT COUNT(designations.id) as count  FROM designations
                      LEFT JOIN designation_translations ON designations.id=designation_translations.designation_id
                      WHERE designation_translations.language=1 AND designation_translations.designation_category_id=${cat_id}`;
        } 
        connection.query(sqlQuery,cb);
    }

    static editDesignation(designation_id,name,cat_id,cb){
        let sqlQuery=`UPDATE designation_translations SET name=?,designation_category_id=? WHERE designation_id=? AND language=1`;
        connection.query(sqlQuery,[name,cat_id,designation_id],cb);
    }

    static addDesignation(inputs,cb){
        let name=inputs.name?inputs.name:'';
        // let cat_id=inputs.designation_category_id?inputs.designation_category_id:'';
        let cat_id=inputs.cat_id?inputs.cat_id:inputs.designation_category_id?inputs.designation_category_id:'';
        let disease=`INSERT designations SET id=NULL`;
        let disease_translations=`INSERT designation_translations SET designation_id=?,designation_category_id=?,language=?,name=?`;
        connection.query(disease,(err,result)=>{
            if(err){
                console.log(err);
            }else{
                connection.query(disease_translations,[result.insertId,cat_id,1,name],cb);
            }
        });
    }

    static deleteDesignation(designation_id,cb){
        let sqlQuery=`DELETE FROM designations WHERE id=${designation_id}`;
        connection.query(sqlQuery,(err,result)=>{
            if(err){
                console.log(err);
            }else{
                connection.query(`DELETE FROM designation_translations WHERE designation_id=${designation_id}`,cb);
            }
        });
    }


}

module.exports=Designation;