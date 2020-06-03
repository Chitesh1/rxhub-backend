let connection=require('../model/connection');
require('dotenv').config()
class AskedQuestion{

    static getQuestionListing(page_count,search_key,cb){
        let pagination=process.env.ADMIN_PAGINATION;
        let skip=parseInt(page_count) * pagination;
        let  sqlQuery;
        if(search_key!=''){
            sqlQuery=`SELECT ask_question.id,ask_question.name,ask_question.email,
            ask_question.mobile_number FROM ask_question WHERE 
            upper(ask_question.name) LIKE '%${search_key.toUpperCase()}%' OR 
            upper(ask_question.email) LIKE '%${search_key.toUpperCase()}%' OR
            upper(ask_question.mobile_number) LIKE '%${search_key.toUpperCase()}%'
            ORDER BY ask_question.id DESC LIMIT ${pagination} OFFSET ${skip}`;
        }else{
             sqlQuery=`SELECT ask_question.id,ask_question.name,ask_question.email,
                      ask_question.mobile_number FROM ask_question 
                      ORDER BY ask_question.id DESC LIMIT ${pagination} OFFSET ${skip}`;
        }
        
        connection.query(sqlQuery,cb);              
    }
    static getQuestionListingCount(search_key,cb){
        let sqlQuery;
        if(search_key!=''){
            sqlQuery=`SELECT ask_question.id,ask_question.name,ask_question.email,
            ask_question.mobile_number FROM ask_question WHERE 
            upper(ask_question.name) LIKE '%${search_key.toUpperCase()}%' OR 
            upper(ask_question.email) LIKE '%${search_key.toUpperCase()}%' OR
            upper(ask_question.mobile_number) LIKE '%${search_key.toUpperCase()}%'`;
        }else{
             sqlQuery=`SELECT COUNT(id) as count FROM ask_question`;
        }
        
        connection.query(sqlQuery,cb);              
    }

    static questionDetail(question_id,cb){
        console.log(question_id);
        let sqlQuery=`SELECT ask_question.id,ask_question.name,ask_question.email,
                      ask_question.mobile_number,(SELECT name FROM designation_translations WHERE designation_id=ask_question.designation_id AND language=1) as designation,
                      ask_question.company_name,ask_question_translations.question,ask_question_translations.question_description as message
                      FROM ask_question LEFT JOIN ask_question_translations ON ask_question.id=ask_question_translations.ask_question_id
                      WHERE ask_question.id=${question_id}  AND ask_question_translations.language=1`;
        connection.query(sqlQuery,cb);
    }

    static deleteQuestion(question_id,cb){
        connection.query(`DELETE from ask_question WHERE id=?`,[question_id],(err,resulst)=>{
            if(err){
                console.log(err);
            }else{
                connection.query(`DELETE from ask_question_translations WHERE ask_question_id=?`,[question_id],cb);
            }
        });
    }

}

module.exports=AskedQuestion;