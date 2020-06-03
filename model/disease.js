let connection=require('../model/connection');
require('dotenv').config();
class Disease{

    static getDiseaseList(page_count,search_key,cb){
        let pagination=process.env.ADMIN_PAGINATION;
        let skip=parseInt(page_count) * pagination;
        let sqlQuery;
        if(search_key!=''){
            sqlQuery=`SELECT diseases.id,disease_translations.name FROM diseases
                      LEFT JOIN disease_translations ON diseases.id=disease_translations.disease_id
                      WHERE disease_translations.language=1 AND upper(disease_translations.name) LIKE '%${search_key.toUpperCase()}%' ORDER BY diseases.id DESC LIMIT ${pagination} OFFSET ${skip}`;
        }else{
            sqlQuery=`SELECT diseases.id,disease_translations.name FROM diseases
                      LEFT JOIN disease_translations ON diseases.id=disease_translations.disease_id
                      WHERE disease_translations.language=1 ORDER BY diseases.id DESC LIMIT ${pagination} OFFSET ${skip}`;
        }
        
        connection.query(sqlQuery,cb);            
    }

    static getDiseaseListCount(search_key,cb){
        let sqlQuery;
        if(search_key!=''){
            sqlQuery=`SELECT COUNT(diseases.id) as count FROM diseases
                      LEFT JOIN disease_translations ON diseases.id=disease_translations.disease_id
                      WHERE disease_translations.language=1 AND upper(disease_translations.name) LIKE '%${search_key.toUpperCase()}%'`;
        }else{
            sqlQuery=`SELECT COUNT(diseases.id) as count FROM diseases
                      LEFT JOIN disease_translations ON diseases.id=disease_translations.disease_id
                      WHERE disease_translations.language=1`;
        }
        connection.query(sqlQuery,cb);
    }

    static getDiseaseListWithoutPagination(cb){
        let sqlQuery;  
        sqlQuery=`SELECT diseases.id,disease_translations.name FROM diseases
                      LEFT JOIN disease_translations ON diseases.id=disease_translations.disease_id
                      WHERE disease_translations.language=1 ORDER BY diseases.id DESC`;
                      connection.query(sqlQuery,cb);
    }

    static editDisease(disease_id,name,cb){
        let sqlQuery=`UPDATE disease_translations SET name=? WHERE disease_id=? AND language=1`;
        connection.query(sqlQuery,[name,disease_id],cb);
    }

    static addDisease(inputs,cb){
        let name=inputs.name?inputs.name:'';
        let disease=`INSERT diseases SET id=NULL`;
        let disease_translations=`INSERT disease_translations SET disease_id=?,language=?,name=?`;
        connection.query(disease,(err,result)=>{
            if(err){
                console.log(err);
            }else{
                connection.query(disease_translations,[result.insertId,1,name],cb);
            }
        });
    }

    static deleteDisease(disease_id,cb){
        let sqlQuery=`DELETE FROM diseases WHERE id=${disease_id}`;
        connection.query(sqlQuery,(err,result)=>{
            if(err){
                console.log(err);
            }else{
                connection.query(`DELETE FROM disease_translations WHERE disease_id=${disease_id}`,cb);
            }
        });
    }


}

module.exports=Disease;