let connection = require('./connection');
require('dotenv').config();
class Faq{

    static getfaqListing(page_count,search_key,cb){
        let pagination=process.env.ADMIN_PAGINATION;
        let skip=parseInt(page_count) * pagination;
        let sqlQuery;
        if(search_key!=''){
            sqlQuery=`SELECT faqs.id,faq_translations.question,faq_translations.answer FROM faqs 
                      LEFT JOIN faq_translations ON faqs.id=faq_translations.faq_id
                      WHERE faq_translations.language=1 AND upper(faq_translations.question) LIKE '%${search_key.toUpperCase()}%' 
                      OR upper(faq_translations.answer) LIKE '%${search_key.toUpperCase()}%' ORDER BY faqs.id DESC LIMIT ${pagination} OFFSET ${skip}`;
        }else{
            sqlQuery=`SELECT faqs.id,faq_translations.question,faq_translations.answer FROM faqs 
                      LEFT JOIN faq_translations ON faqs.id=faq_translations.faq_id
                      WHERE faq_translations.language=1 ORDER BY faqs.id DESC LIMIT ${pagination} OFFSET ${skip}`;
        }
        
        connection.query(sqlQuery,cb);              
    }
    static getFaqListingCount(search_key,cb){
        let sqlQuery;
        if(search_key!=''){
            sqlQuery=`SELECT COUNT(faqs.id) as count FROM faqs 
        LEFT JOIN faq_translations ON faqs.id=faq_translations.faq_id
        WHERE faq_translations.language=1 AND upper(faq_translations.question) LIKE '%${search_key.toUpperCase()}%' 
        OR upper(faq_translations.answer) LIKE '%${search_key.toUpperCase()}%'`;
        }else{
             sqlQuery=`SELECT COUNT(faqs.id) as count FROM faqs 
        LEFT JOIN faq_translations ON faqs.id=faq_translations.faq_id
        WHERE faq_translations.language=1 `;
        }
        
        connection.query(sqlQuery,cb);              
    }
    static createFaq(inputs,cb){
        let question=inputs.question?inputs.question:'';
        let answer=inputs.answer?inputs.answer:"";
        let create=`INSERT faqs SET id=NULL`;
        connection.query(create,(err,result)=>{
            if(err){
                console.log(err);
            }else{
                connection.query(`INSERT faq_translations SET faq_id=? ,question=?,answer=?,language=?`,[result.insertId,question,answer,1],cb);
            }
        });
    }

    static detailFaq(id,cb){
        let sqlQuery=`SELECT faqs.id,faq_translations.question,faq_translations.answer FROM faqs 
                      LEFT JOIN faq_translations ON faqs.id=faq_translations.faq_id
                      WHERE faq_translations.language=1 AND faqs.id=${id}`;
        connection.query(sqlQuery,cb);  
    }

    static updateFaq(faq_id,inputs,cb){
        let question=inputs.question?inputs.question:'';
        let answer=inputs.answer?inputs.answer:"";
        connection.query(`UPDATE faq_translations SET question=?,answer=? WHERE faq_id=? AND language=?`,[question,answer,faq_id,1],cb);
    }

    static deleteFaq(faq_id,cb){
        connection.query(`DELETE from faqs WHERE id=?`,[faq_id],(err,resulst)=>{
            if(err){
                console.log(err);
            }else{
                connection.query(`DELETE from faq_translations WHERE faq_id=?`,[faq_id],cb);
            }
        });
    }
}

module.exports=Faq;