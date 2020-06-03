let connection=require('../model/connection');
require('dotenv').config();
class Symptom{

    static getSymptomList(page_count,cb){
        let pagination=process.env.ADMIN_PAGINATION;
        let skip=parseInt(page_count) * pagination;
        console.log(pagination,skip);
        let sqlQuery=`SELECT symptom.id,symptom_translations.name,symptom_translations.id as translation_id,
                      body_part_translations.body_part_id,body_part_translations.name as body_part_name,body_parts.gender FROM symptom
                      LEFT JOIN symptom_translations ON symptom.id=symptom_translations.symptom_id
                      LEFT JOIN body_part_translations ON symptom_translations.body_part_id=body_part_translations.body_part_id 
                      LEFT JOIN body_parts ON symptom_translations.body_part_id = body_parts.id
                      WHERE symptom_translations.language=1 AND body_part_translations.language=1  ORDER BY symptom.id DESC LIMIT ${pagination} OFFSET ${skip}`;
        connection.query(sqlQuery,cb);            
    }

    static getSymptomListAccordingToBodyPart(cb){
        let sqlQuery=`SELECT symptom_translations.symptom_id as id,symptom_translations.name,symptom_translations.id as translation_id,
        symptom_translations.body_part_id,body_part_translations.name as body_part_name,body_parts.gender,body_parts.id as body_part_id FROM symptom_translations
                      LEFT JOIN body_part_translations ON symptom_translations.body_part_id=body_part_translations.body_part_id 
                      LEFT JOIN body_parts ON symptom_translations.body_part_id=body_parts.id 
                      WHERE symptom_translations.language=1 ORDER BY symptom_translations.id DESC`;
        
        connection.query(sqlQuery,cb);  
    }

    static getBodyPartsName(symptoms,cb){
         symptoms.forEach(async element=>{
            let sqlQuery=`SELECT symptom_translations.body_part_id,body_part_translations.name,body_parts.gender FROM symptom_translations 
                          LEFT JOIN body_parts ON symptom_translations.body_part_id=body_parts.id
                          LEFT JOIN body_part_translations ON symptom_translations.body_part_id=body_part_translations.body_part_id
                          WHERE symptom_translations.symptom_id=${element.id} AND symptom_translations.language=1 AND body_part_translations.language=1`;
            await connection.query(sqlQuery,(err,result)=>{
                if(err){
                    console.log(err);
                }else{ 
                    console.log(result,element.id);
                }
            });
        });
        
    }

    static getSymptomListCount(cb){
        let sqlQuery=`SELECT COUNT(symptom.id) as count FROM symptom
        LEFT JOIN symptom_translations ON symptom.id=symptom_translations.symptom_id
        LEFT JOIN body_part_translations ON symptom_translations.body_part_id=body_part_translations.body_part_id 
        LEFT JOIN body_parts ON symptom_translations.body_part_id = body_parts.id
        WHERE symptom_translations.language=1 AND body_part_translations.language=1`;  
        connection.query(sqlQuery,cb);
    }

    static editSymptom(symptom_translation_id,part_id,name,cb){
        let sqlQuery=`UPDATE symptom_translations SET name=?,body_part_id=? WHERE id=? AND language=1`;
        connection.query(sqlQuery,[name,part_id,symptom_translation_id],cb);
    }

    static addSymptom(inputs,cb){
        let body_part_id=inputs.body_part_id?inputs.body_part_id:'';
        let symptom=inputs.symptom;
        
        symptom.forEach(element => {
            
            let symptom=`INSERT symptom SET id=NULL`;
            let symptom_translations=`INSERT symptom_translations SET symptom_id=?,body_part_id=?,language=?,name=?`;
            connection.query(symptom,(err,result)=>{
                if(err){
                    console.log(err);
                }else{
                    console.log(result);
                    connection.query(symptom_translations,[result.insertId,body_part_id,1,element.name],cb);
                }
            });
        });
            
    }

    static deleteSymptom(symptom_id,cb){
        console.log(symptom_id);
        let sqlQuery=`DELETE FROM symptom WHERE id=${symptom_id}`;
        connection.query(sqlQuery,(err,result)=>{
            if(err){
                console.log(err);
            }else{
                connection.query(`DELETE FROM symptom_translations WHERE symptom_id=${symptom_id}`,cb);
            }
        });
    }


}

module.exports=Symptom;