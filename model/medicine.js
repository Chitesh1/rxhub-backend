let connection=require('../model/connection');
let bcrypt = require('bcrypt');
let logs = require('../config/log');
require('dotenv').config();
class Medicine{

    static listMedicines(data,type,cb){
        let pagination=process.env.PAGINATION;
        let page_count=data.page_count?data.page_count:0;
        let skip=parseInt(page_count) * pagination;
        let language_id=data.language_id?data.language_id:'';
        let search_key=data.search?data.search:'';
        let gender=data.gender?data.gender:"";
        let sqlQuery;
        if(type==0){ //drug by system
            if(search_key && search_key!=''){ //if search in system
                sqlQuery=`SELECT med_systems.id ,med_system_translations.name FROM med_systems 
            LEFT JOIN med_system_translations ON med_systems.id=med_system_translations.med_system_id
            WHERE med_system_translations.language=? AND upper(med_system_translations.name) LIKE '%${search_key.toUpperCase()}%' LIMIT ${pagination} OFFSET ${skip}`;
            }else{ //if not
                sqlQuery=`SELECT med_systems.id ,med_system_translations.name FROM med_systems 
            LEFT JOIN med_system_translations ON med_systems.id=med_system_translations.med_system_id
            WHERE med_system_translations.language=? LIMIT ${pagination} OFFSET ${skip}`;
            }
        }else if(type ==1){ //drugs a to z
             sqlQuery=`SELECT medicines.id ,medicine_translations.name FROM medicines 
            LEFT JOIN medicine_translations ON medicines.id=medicine_translations.medicine_id
            WHERE medicine_translations.language=? ORDER BY medicine_translations.name ASC LIMIT ${pagination} OFFSET ${skip}`;
        }else if(type==2){ //drugs by diseases
            if(search_key && search_key!=''){ //if search in disease
                sqlQuery=`SELECT diseases.id ,disease_translations.name FROM diseases 
            LEFT JOIN disease_translations ON diseases.id=disease_translations.disease_id
            WHERE disease_translations.language=? AND upper(disease_translations.name) LIKE '%${search_key.toUpperCase()}%' LIMIT ${pagination} OFFSET ${skip}`;
            }else{
                sqlQuery=`SELECT diseases.id ,disease_translations.name FROM diseases 
            LEFT JOIN disease_translations ON diseases.id=disease_translations.disease_id
            WHERE disease_translations.language=? LIMIT ${pagination} OFFSET ${skip}`;
            }
        }else if(type==3){ //drugs by brand
            if(search_key && search_key!=''){
                sqlQuery=`SELECT brands.id ,brand_translations.name FROM brands 
            LEFT JOIN brand_translations ON brands.id=brand_translations.brand_id
            WHERE brand_translations.language=? AND upper(brand_translations.name) LIKE '%${search_key.toUpperCase()}%' LIMIT ${pagination} OFFSET ${skip}`;
            }else{
                sqlQuery=`SELECT brands.id ,brand_translations.name FROM brands 
            LEFT JOIN brand_translations ON brands.id=brand_translations.brand_id
            WHERE brand_translations.language=? LIMIT ${pagination} OFFSET ${skip}`;
            }
        }else if(type==4){ //generic drugs
            if(search_key && search_key!=''){
                sqlQuery=`SELECT generic_names.id,generic_name_translations.name FROM generic_names 
            LEFT JOIN generic_name_translations ON generic_names.id=generic_name_translations.generic_name_id
            WHERE generic_name_translations.language=? AND upper(generic_name_translations.name) LIKE '%${search_key.toUpperCase()}%' LIMIT ${pagination} OFFSET ${skip}`;
            }else{
                sqlQuery=`SELECT generic_names.id,generic_name_translations.name FROM generic_names 
            LEFT JOIN generic_name_translations ON generic_names.id=generic_name_translations.generic_name_id
            WHERE generic_name_translations.language=? LIMIT ${pagination} OFFSET ${skip}`;
            }
             
        }else if(type==5){ //symptom checker
             sqlQuery=`SELECT body_parts.id,body_parts.image,body_part_translations.name FROM body_parts 
            LEFT JOIN body_part_translations ON body_parts.id=body_part_translations.body_part_id
            WHERE body_part_translations.language=? AND body_parts.gender=${gender} LIMIT ${pagination} OFFSET ${skip}`;
        }
        connection.query(sqlQuery,[language_id],cb);
    }

    static listMedicinesCount(data,type,cb){
        let pagination=process.env.PAGINATION;
        let page_count=data.page_count?data.page_count:0;
        let skip=parseInt(page_count) * pagination;
        let language_id=data.language_id?data.language_id:'';
        let search_key=data.search?data.search:'';
        let gender=data.gender?data.gender:"";
        let sqlQuery;
        if(type==0){ //drug by system
            if(search_key && search_key!=''){
                sqlQuery=`SELECT med_systems.id ,med_system_translations.name FROM med_systems 
            LEFT JOIN med_system_translations ON med_systems.id=med_system_translations.med_system_id
            WHERE med_system_translations.language=? AND upper(med_system_translations.name) LIKE '%${search_key.toUpperCase()}%' `;
            }else{
                sqlQuery=`SELECT med_systems.id ,med_system_translations.name FROM med_systems 
            LEFT JOIN med_system_translations ON med_systems.id=med_system_translations.med_system_id
            WHERE med_system_translations.language=? `;
            }
             
        }else if(type ==1){ //drugs a to z
             sqlQuery=`SELECT medicines.id ,medicine_translations.name FROM medicines 
            LEFT JOIN medicine_translations ON medicines.id=medicine_translations.medicine_id
            WHERE medicine_translations.language=? ORDER BY medicine_translations.name ASC `;
        }else if(type==2){ //drugs by diseases
            if(search_key && search_key!=''){
                sqlQuery=`SELECT diseases.id ,disease_translations.name FROM diseases 
                LEFT JOIN disease_translations ON diseases.id=disease_translations.disease_id
                WHERE disease_translations.language=? AND upper(disease_translations.name) LIKE '%${search_key.toUpperCase()}%'`;
            }else{
                sqlQuery=`SELECT diseases.id ,disease_translations.name FROM diseases 
                LEFT JOIN disease_translations ON diseases.id=disease_translations.disease_id
                WHERE disease_translations.language=?`;
            }
            
        }else if(type==3){ //drugs by brand
            if(search_key && search_key!=''){
                sqlQuery=`SELECT brands.id ,brand_translations.name FROM brands 
            LEFT JOIN brand_translations ON brands.id=brand_translations.brand_id
            WHERE brand_translations.language=? AND upper(brand_translations.name) LIKE '%${search_key.toUpperCase()}%'`;
            }else{
                sqlQuery=`SELECT brands.id ,brand_translations.name FROM brands 
            LEFT JOIN brand_translations ON brands.id=brand_translations.brand_id
            WHERE brand_translations.language=?`;
            }
             
        }else if(type==4){ //generic drugs
            if(search_key && search_key!=''){
                sqlQuery=`SELECT generic_names.id,generic_name_translations.name FROM generic_names 
            LEFT JOIN generic_name_translations ON generic_names.id=generic_name_translations.generic_name_id
            WHERE generic_name_translations.language=? AND upper(generic_name_translations.name) LIKE '%${search_key.toUpperCase()}%'`;
            }else{
                sqlQuery=`SELECT generic_names.id,generic_name_translations.name FROM generic_names 
            LEFT JOIN generic_name_translations ON generic_names.id=generic_name_translations.generic_name_id
            WHERE generic_name_translations.language=?`;
            }
             
        }else if(type==5){ //symptom checker
             sqlQuery=`SELECT body_parts.id,body_parts.image,body_part_translations.name FROM body_parts 
            LEFT JOIN body_part_translations ON body_parts.id=body_part_translations.body_part_id
            WHERE body_part_translations.language=? AND body_parts.gender=${gender}`;
        }
        connection.query(sqlQuery,[language_id],cb);
    }

    static detailMedicine(req,cb){
        let params=req.params;
        let query=req.query;
        let id=params.medicine_id?params.medicine_id:'';
        let language_id=query.language_id?query.language_id:1;
        let designation_id=req.user.designation_id?req.user.designation_id:0;
        let  sqlQuery;
        //checking if specific designation_id or langauge available in notes
        let sequery=`SELECT special_instructions.instruction FROM special_instructions 
       
        WHERE  special_instructions.designation_id=${designation_id} AND special_instructions.medicine_id=${id}  AND special_instructions.language=${language_id}`;
       
        connection.query(sequery,(err,result)=>{
            if(err){
                console.log(err);
            }else{
                console.log('check',result,designation_id);
                if(result.length>0){ // if medicine id and language is present     
                    if(designation_id!=''){
                        console.log('designation present');
                        sqlQuery=`SELECT generic_name_translations.name as generic_name,category_translations.name as category,
                  brand_translations.name as brand_name,medicines.id as medicine_id,medicines.image,medicine_translations.*,
                  ifnull(special_instructions.instruction,"Null") as instruction,disease_translations.name as indication_name FROM medicines 
                                  LEFT JOIN medicine_translations ON medicines.id=medicine_translations.medicine_id
                                  LEFT JOIN generic_name_translations ON medicines.generic_name_id = generic_name_translations.generic_name_id
                                  LEFT JOIN brand_translations ON medicines.brand_id = brand_translations.brand_id
                                  LEFT JOIN special_instructions ON medicines.id = special_instructions.medicine_id 
                                  LEFT JOIN category_translations ON medicines.category_id=category_translations.category_id
                                  LEFT JOIN disease_translations ON medicines.disease_id=disease_translations.disease_id
                                  WHERE medicines.id =${id} AND special_instructions.designation_id=${designation_id}  AND 
                                  special_instructions.language=${language_id} AND disease_translations.language=1 AND
                                  generic_name_translations.language=1  AND brand_translations.language=1
                                  AND medicine_translations.language=${language_id} AND category_translations.language=1`;
                    }else{               
                        sqlQuery=`SELECT generic_name_translations.name as generic_name,category_translations.name as category,
                        brand_translations.name as brand_name,medicines.id as medicine_id,medicines.image,medicine_translations.*,special_instructions.instruction,disease_translations.name as indication_name
                         FROM medicines LEFT JOIN medicine_translations ON medicines.id=medicine_translations.medicine_id
                                        LEFT JOIN generic_name_translations ON medicines.generic_name_id = generic_name_translations.generic_name_id
                                        LEFT JOIN brand_translations ON medicines.brand_id = brand_translations.brand_id
                                        LEFT JOIN category_translations ON medicines.category_id=category_translations.category_id
                                        LEFT JOIN special_instructions ON medicines.designation_id=special_instructions.designation_id
                                        LEFT JOIN disease_translations ON medicines.disease_id=disease_translations.disease_id
                                        WHERE medicines.id =${id}  AND special_instructions.language=${language_id} 
                                        AND special_instructions.medicine_id=${id} AND disease_translations.language=1 AND
                                        generic_name_translations.language=1  AND brand_translations.language=1
                                        AND medicine_translations.language=${language_id} AND category_translations.language=1`; 
                    }
                }else{ //if not present    
                    console.log('notes and language not present!');           
                    sqlQuery=`SELECT generic_name_translations.name as generic_name,category_translations.name as category,
                    brand_translations.name as brand_name,medicines.id as medicine_id,medicines.image,medicine_translations.*,disease_translations.name as indication_name,special_instructions.instruction
                     FROM medicines LEFT JOIN medicine_translations ON medicines.id=medicine_translations.medicine_id
                                    LEFT JOIN generic_name_translations ON medicines.generic_name_id = generic_name_translations.generic_name_id
                                    LEFT JOIN brand_translations ON medicines.brand_id = brand_translations.brand_id
                                    LEFT JOIN category_translations ON medicines.category_id=category_translations.category_id
                                    LEFT JOIN disease_translations ON medicines.disease_id=disease_translations.disease_id
                                    LEFT JOIN special_instructions ON medicines.designation_id=special_instructions.designation_id
                                    WHERE medicines.id =${id}  AND disease_translations.language=1 AND special_instructions.language=${language_id} AND
                                    generic_name_translations.language=1  AND brand_translations.language=1
                                    AND medicine_translations.language=${language_id} AND category_translations.language=1`;
                }
            }
           
            connection.query(sqlQuery,cb);
        });
        
    }

    static addSearchedMedicineRecordDetail(user_id,medicine_id){
        console.log(user_id,medicine_id);
        let getCount=`SELECT count(id) as count FROM searched_medicines WHERE  user_id=?`;
        connection.query(getCount,[user_id],(err,result)=>{
            if(err){
                console.log(err)
            }else{
                console.log('COUNT '+result[0].count);
                if(result[0].count  > process.env.SEARCHED_RECORD){ //if record is greater than set records
                    let deleteRecordCount=parseInt(result[0].count)-process.env.SEARCHED_RECORD; 
                    console.log(deleteRecordCount); 
                    let deleteQuery=`DELETE FROM searched_medicines ORDER BY id DESC LIMIT ${deleteRecordCount}`;
                    connection.query(deleteQuery,(err,result)=>{if(err){console.log(err)}});
                }
            }
        });
        let findQuery=`SELECT id from searched_medicines WHERE user_id=? AND medicine_id=?`;
        let sqlQuery=`INSERT searched_medicines SET user_id=?,medicine_id=?`;
        let updateQuery=`UPDATE searched_medicines SET created_at=CURRENT_TIMESTAMP WHERE id=?`;
        connection.query(findQuery,[user_id,medicine_id],(err,result)=>{
            if(err){
                console.log(err);
            }else{
                if(result.length>0){
                    connection.query(updateQuery,[result[0].id],(err,result)=>{if(err){console.log(err)}});
                }else{
                    connection.query(sqlQuery,[user_id,medicine_id],(err,result)=>{if(err){console.log(err)}});
                }
            }
        });
    }


    static newDetailMedicine(req,cb){
        let params=req.params;
        let query=req.query;
        let id=params.medicine_id?params.medicine_id:'';
        let language_id=query.language_id?query.language_id:1;
        let designation_id=req.user.designation_id?req.user.designation_id:'';
        let sqlQuery=`SELECT generic_name_translations.name as generic_name,category_translations.name as category,
                  brand_translations.name as brand_name,medicines.id as medicine_id,medicines.designation_id,medicines.image,medicine_translations.id,
                  medicine_translations.language,medicine_translations.name,medicine_translations.symptom,medicine_translations.drug_form,
                  medicine_translations.indication,disease_translations.name as indication_name FROM medicines 
                                  LEFT JOIN medicine_translations ON medicines.id=medicine_translations.medicine_id
                                  LEFT JOIN generic_name_translations ON medicines.generic_name_id = generic_name_translations.generic_name_id
                                  LEFT JOIN brand_translations ON medicines.brand_id = brand_translations.brand_id
                                  LEFT JOIN category_translations ON medicines.category_id=category_translations.category_id
                                  LEFT JOIN disease_translations ON medicines.disease_id=disease_translations.disease_id
                                  WHERE medicines.id =${id}  AND disease_translations.language=1 AND
                                  generic_name_translations.language=1  AND brand_translations.language=1
                                  AND medicine_translations.language=1 AND category_translations.language=1`;
                                  this.addSearchedMedicineRecordDetail(req.user.id,id);
        connection.query(sqlQuery,cb);
    }

    static getMobileNotes(req,medicine_designation_id=null,cb){
        let params=req.params;
        let query=req.query;
        let id=params.medicine_id?params.medicine_id:'';
        let language_id=query.language_id?query.language_id:1;
        let designation_id=req.user.designation_id?req.user.designation_id:0;
        console.log(req.user.designation_id);
        let sqlQuery;
        connection.query(`SELECT instruction FROM special_instructions WHERE medicine_id=${id} AND designation_id=${designation_id} AND language=${language_id}`,(err,check)=>{
            if(err){
                console.log(err);
            }else{
                if(check.length>0){
                    if(designation_id!=''){
                        sqlQuery=`SELECT instruction FROM special_instructions WHERE medicine_id=${id} AND designation_id=${designation_id} AND language=${language_id}`;
                    }else{
                        sqlQuery=`SELECT instruction FROM special_instructions WHERE medicine_id=${id} AND designation_id=${medicine_designation_id} AND language=${language_id}`;
                    }
                     
                }else{
                    sqlQuery=`SELECT instruction FROM special_instructions WHERE medicine_id=${id} AND designation_id=${medicine_designation_id} AND language=${language_id}`;
                }
            }   
            connection.query(sqlQuery,cb);
        }); 
    }

    static getMobileClassfication(req,cb){
        let params=req.params;
        let query=req.query;
        let id=params.medicine_id?params.medicine_id:'';
        let language_id=query.language_id?query.language_id:1;
        console.log(id,language_id);
        let sqlQuery=`SELECT classification FROM medicine_translations WHERE medicine_id=${id} AND language=${language_id}`;
        connection.query(sqlQuery,cb); 
    }
    static createConsumptionRecord(user_id,medicine_id){
        let sql=`INSERT consumptions SET user_id=?,medicine_id=?`;
        connection.query(sql,[user_id,medicine_id],(err,result)=>{
            if(err){
                console.log(err);
            }else{
                console.log(result);
            }
        });
    }
    static subcategories(data,cb){
        let type=data.type?data.type:'';
        let language_id=data.language_id?data.language_id:'';
        let id=data.id?data.id:'';
        let sqlQuery;
        if(type==0){ //drug by system
            sqlQuery=`SELECT generic_name_translations.name as generic_name,brand_translations.name as brand_name,medicines.id as medicine_id,medicine_translations.* FROM medicines 
                      LEFT JOIN medicine_translations ON medicines.id=medicine_translations.medicine_id
                      LEFT JOIN generic_name_translations ON medicines.generic_name_id = generic_name_translations.generic_name_id
                      LEFT JOIN brand_translations ON medicines.brand_id = brand_translations.brand_id
                      WHERE medicines.med_system_id=${id} 
                       AND generic_name_translations.language=${language_id}  AND brand_translations.language=${language_id} AND medicine_translations.language=${language_id}`;
        }else if(type==1){ //drugs a to z
            
            sqlQuery=`SELECT generic_name_translations.name as generic_name,brand_translations.name as brand_name,medicines.id as medicine_id,medicine_translations.*,special_instructions.instruction FROM medicines 
                      LEFT JOIN medicine_translations ON medicines.id=medicine_translations.medicine_id
                      LEFT JOIN generic_name_translations ON medicines.generic_name_id = generic_name_translations.generic_name_id
                      LEFT JOIN brand_translations ON medicines.brand_id = brand_translations.brand_id
                      LEFT JOIN special_instructions ON medicines.id = special_instructions.medicine_id
                      WHERE medicines.id=${id} 
                       AND generic_name_translations.language=${language_id}  AND brand_translations.language=${language_id} AND medicine_translations.language=${language_id}`;
        }else if(type == 2){ //drugs by diseases
            sqlQuery=`SELECT generic_name_translations.name as generic_name,brand_translations.name as brand_name,medicines.id as medicine_id,medicine_translations.* FROM medicines 
                      LEFT JOIN medicine_translations ON medicines.id=medicine_translations.medicine_id
                      LEFT JOIN generic_name_translations ON medicines.generic_name_id = generic_name_translations.generic_name_id
                      LEFT JOIN brand_translations ON medicines.brand_id = brand_translations.brand_id
                      WHERE medicines.disease_id =${id}
                       AND generic_name_translations.language=${language_id}  AND brand_translations.language=${language_id} AND medicine_translations.language=${language_id}`;
        }else if(type ==3){ //drugs by brand
            sqlQuery=`SELECT generic_name_translations.name as generic_name,brand_translations.name as brand_name,medicines.id as medicine_id,medicine_translations.* FROM medicines 
                      LEFT JOIN medicine_translations ON medicines.id=medicine_translations.medicine_id
                      LEFT JOIN generic_name_translations ON medicines.generic_name_id = generic_name_translations.generic_name_id
                      LEFT JOIN brand_translations ON medicines.brand_id = brand_translations.brand_id
                      WHERE medicines.brand_id=${id} 
                       AND generic_name_translations.language=${language_id}  AND brand_translations.language=${language_id} AND medicine_translations.language=${language_id}`;
        }else if(type==4){ //generic drugs
            sqlQuery=`SELECT generic_name_translations.name as generic_name,brand_translations.name as brand_name,medicines.id as medicine_id,medicine_translations.* FROM medicines 
                      LEFT JOIN medicine_translations ON medicines.id=medicine_translations.medicine_id
                      LEFT JOIN generic_name_translations ON medicines.generic_name_id = generic_name_translations.generic_name_id
                      LEFT JOIN brand_translations ON medicines.brand_id = brand_translations.brand_id
                      WHERE medicines.generic_name_id=${id} 
                       AND generic_name_translations.language=${language_id}  AND brand_translations.language=${language_id} AND medicine_translations.language=${language_id}`;
        }else if(type==5){ //symptom checker
            sqlQuery=`SELECT disease_translations.name as disease_name,generic_name_translations.name as generic_name,brand_translations.name as brand_name,medicines.id as medicine_id,medicine_translations.* FROM medicines 
                      LEFT JOIN medicine_translations ON medicines.id=medicine_translations.medicine_id
                      LEFT JOIN generic_name_translations ON medicines.generic_name_id = generic_name_translations.generic_name_id
                      LEFT JOIN brand_translations ON medicines.brand_id = brand_translations.brand_id
                      LEFT JOIN disease_translations ON medicines.disease_id=disease_translations.disease_id
                      WHERE medicines.body_part_id=${id} AND disease_translations.language=${language_id}
                      AND generic_name_translations.language=${language_id}  AND brand_translations.language=${language_id} AND medicine_translations.language=${language_id}`;
        }

        connection.query(sqlQuery,cb);
    }

    static searchMedicines(data,cb){
        let search_key=data?data.toUpperCase():'';
        let sqlQuery=`SELECT medicine_translations.name,medicine_translations.medicine_id FROM medicine_translations WHERE upper(name) LIKE '%${search_key}%'`;
        connection.query(sqlQuery,[],cb);
    }

    static sortMedicines(data,cb){
        let search_key=data.search_key?data.search_key:'';
    }

    static getNewDrugs(cb){
      
    }

    static addSearchedMedicineRecord(user_id,search_key,language_id){
            
              //making record for searched medicines
              let searchsql=`SELECT medicine_translations.name,medicine_translations.medicine_id FROM 
              medicine_translations WHERE upper(name) LIKE '%${search_key}%' 
              AND medicine_translations.language=${language_id}`;
              
             connection.query(searchsql,(err,result)=>{ //creating record for searched medicines
                 if(err){
                     console.log(err);
                 }else{
                     console.log(result);
                     if(result.length>0){
                        
                         let findQuery=`SELECT id from searched_medicines WHERE user_id=? AND medicine_id=?`;
                         let insertQuery=`INSERT searched_medicines set user_id=?,medicine_id=?`;
                         let updateQuery=`UPDATE searched_medicines SET created_at=CURRENT_TIMESTAMP WHERE id=?`;
                          for(let i=0;i<result.length;i++){
                              console.log(result[i]);
                              connection.query(findQuery,[user_id,result[i].medicine_id],(err,find)=>{
                                  if(err){
                                      console.log(err);
                                  }else{
                                      if(find.length>0){ //updating resul
                                            connection.query(updateQuery,[find[0].id],(err,result)=>{
                                                if(err){
                                                    console.log(err);
                                                }
                                            });
                                        
                                        
                                      }else{ //inserting result
                                        console.log('insertResult');
                                        connection.query(insertQuery,[user_id,result[i].medicine_id],(err,result)=>{});
                                      }
                                  }
                              });
                          }
                     }else{
     
                     }
                 }
             });
    }

    static getFilteredResults(data,user_id,cb){
       
        let pagination=process.env.PAGINATION;
        let page_count=data.page_count?data.page_count:0;
        let skip=parseInt(page_count) * pagination;
        let checknew = data.new?data.new:0;
        let language_id=data.language_id?data.language_id:0;
        let sqlQuery='';
        if(data.alphabet && data.alphabet!=''){ // for a to z system sorting
            sqlQuery=`SELECT medicines.id ,medicine_translations.name FROM medicines 
            LEFT JOIN medicine_translations ON medicines.id=medicine_translations.medicine_id
            WHERE medicine_translations.name LIKE '${data.alphabet}%' AND medicine_translations.language=${language_id} ORDER BY medicine_translations.name ASC LIMIT ${pagination} OFFSET ${skip}`;
            
        }else if(data.new && data.new!=''){ //for new medicines
            if(data.search && data.search!=''){
                let search_key=data.search.toUpperCase();
                sqlQuery=`SELECT medicines.id ,medicine_translations.name FROM medicines 
            LEFT JOIN medicine_translations ON medicines.id=medicine_translations.medicine_id
            WHERE medicines.created_at > DATE_SUB(CURDATE(), INTERVAL 1 DAY) 
            AND upper(medicine_translations.name) LIKE '%${search_key}%'
            AND medicine_translations.language=${language_id} ORDER BY medicine_translations.name ASC `;
            }else{
                sqlQuery=`SELECT medicines.id ,medicine_translations.name FROM medicines 
            LEFT JOIN medicine_translations ON medicines.id=medicine_translations.medicine_id
            WHERE medicines.created_at > DATE_SUB(CURDATE(), INTERVAL 1 DAY) 
            AND medicine_translations.language=${language_id} ORDER BY medicine_translations.name ASC `;
            }
        }else if(data.system_id && data.system_id!=''){ //drug by system
            if(data.search && data.search!=''){ // if system + search is active
                let search_key=data.search.toUpperCase();
                sqlQuery=`SELECT medicines.id ,medicine_translations.name FROM medicines 
                LEFT JOIN medicine_translations ON medicines.id=medicine_translations.medicine_id
                WHERE medicines.med_system_id = ${data.system_id} AND upper(medicine_translations.name) LIKE '%${search_key}%' 
                AND medicine_translations.language=${language_id} ORDER BY medicine_translations.name ASC LIMIT ${pagination} OFFSET ${skip}`; 
                // this.addSearchedMedicineRecord(user_id,search_key,language_id);
            }else{ // if search is not set
                sqlQuery=`SELECT medicines.id ,medicine_translations.name FROM medicines 
                LEFT JOIN medicine_translations ON medicines.id=medicine_translations.medicine_id
                WHERE medicines.med_system_id = ${data.system_id} AND medicine_translations.language=${language_id} ORDER BY medicine_translations.name ASC LIMIT ${pagination} OFFSET ${skip}`;   
            }
        }else if(data.brand_id && data.brand_id!=''){ //drug by brand
            if(data.search && data.search!=''){ // if brand + search is active
                let search_key=data.search.toUpperCase();
                sqlQuery=`SELECT medicines.id ,medicine_translations.name FROM medicines 
            LEFT JOIN medicine_translations ON medicines.id=medicine_translations.medicine_id
            WHERE medicines.brand_id = ${data.brand_id} AND upper(medicine_translations.name) LIKE '%${search_key}%' AND medicine_translations.language=${language_id} 
            ORDER BY medicine_translations.name ASC LIMIT ${pagination} OFFSET ${skip}`;
            // this.addSearchedMedicineRecord(user_id,search_key,language_id);
            }else{
                sqlQuery=`SELECT medicines.id ,medicine_translations.name FROM medicines 
            LEFT JOIN medicine_translations ON medicines.id=medicine_translations.medicine_id
            WHERE medicines.brand_id = ${data.brand_id} AND medicine_translations.language=${language_id} ORDER BY medicine_translations.name ASC LIMIT ${pagination} OFFSET ${skip}`;
            }
            
        }else if(data.disease_id && data.disease_id!=''){ //drug by disease
            if(data.search && data.search!=''){ //if disease + search
                let search_key=data.search.toUpperCase();
                sqlQuery=`SELECT medicines.id ,medicine_translations.name FROM medicines 
            LEFT JOIN medicine_translations ON medicines.id=medicine_translations.medicine_id
            WHERE medicines.disease_id = ${data.disease_id} AND upper(medicine_translations.name) LIKE '%${search_key}%' AND medicine_translations.language=${language_id} 
            ORDER BY medicine_translations.name ASC LIMIT ${pagination} OFFSET ${skip}`;
            // this.addSearchedMedicineRecord(user_id,search_key,language_id);
            }else{
                sqlQuery=`SELECT medicines.id ,medicine_translations.name FROM medicines 
            LEFT JOIN medicine_translations ON medicines.id=medicine_translations.medicine_id
            WHERE medicines.disease_id = ${data.disease_id} AND medicine_translations.language=${language_id} ORDER BY medicine_translations.name ASC LIMIT ${pagination} OFFSET ${skip}`;
            }
            
        }else if(data.generic_id && data.generic_id!=''){
            if(data.search && data.search!=''){
                let search_key=data.search.toUpperCase();
                sqlQuery=`SELECT medicines.id ,medicine_translations.name FROM medicines 
            LEFT JOIN medicine_translations ON medicines.id=medicine_translations.medicine_id
            WHERE medicines.generic_name_id = ${data.generic_id} AND upper(medicine_translations.name) LIKE '%${search_key}%' AND medicine_translations.language=${language_id} 
            ORDER BY medicine_translations.name ASC LIMIT ${pagination} OFFSET ${skip}`;
            // this.addSearchedMedicineRecord(user_id,search_key,language_id);
            }else{
                sqlQuery=`SELECT medicines.id ,medicine_translations.name FROM medicines 
            LEFT JOIN medicine_translations ON medicines.id=medicine_translations.medicine_id
            WHERE medicines.generic_name_id = ${data.generic_id} AND medicine_translations.language=${language_id} ORDER BY medicine_translations.name ASC LIMIT ${pagination} OFFSET ${skip}`;
            }
            
        }else if(data.symptom_id && data.symptom_id!=''){
            if(data.search && data.search!=''){
                let search_key=data.search.toUpperCase();
                sqlQuery=`SELECT medicine_symptoms.medicine_id as id,medicine_translations.name FROM medicine_symptoms 
            LEFT JOIN medicine_translations ON medicine_symptoms.medicine_id=medicine_translations.medicine_id
            WHERE medicine_symptoms.symptom_id = ${data.symptom_id} AND upper(medicine_translations.name) LIKE '${search_key}'AND medicine_translations.language=${language_id} 
            ORDER BY medicine_translations.name ASC LIMIT ${pagination} OFFSET ${skip}`;
            // this.addSearchedMedicineRecord(user_id,search_key,language_id);
            }else{
                sqlQuery=`SELECT medicine_symptoms.medicine_id as id,medicine_translations.name FROM medicine_symptoms 
            LEFT JOIN medicine_translations ON medicine_symptoms.medicine_id=medicine_translations.medicine_id
            WHERE medicine_symptoms.symptom_id = ${data.symptom_id} AND medicine_translations.language=${language_id} ORDER BY medicine_translations.name ASC LIMIT ${pagination} OFFSET ${skip}`;
            }
        }else if(data.search && data.search!=''){
            let search_key=data.search?data.search.toUpperCase():'';
         sqlQuery=`SELECT medicine_translations.name,medicine_translations.medicine_id FROM 
         medicine_translations WHERE upper(name) LIKE '%${search_key}%' 
         AND medicine_translations.language=${language_id} LIMIT ${pagination} OFFSET ${skip}`;
            //making record for searched medicines
            //send user_id and search_key
            // this.addSearchedMedicineRecord(user_id,search_key,language_id);
        }
        else{ // listing all medicines
            sqlQuery=`SELECT medicines.id ,medicine_translations.name FROM medicines 
            LEFT JOIN medicine_translations ON medicines.id=medicine_translations.medicine_id
            WHERE medicine_translations.language=${language_id} ORDER BY medicine_translations.name ASC LIMIT ${pagination} OFFSET ${skip}`; 
        }
        connection.query(sqlQuery,cb);
    }

    static getFilteredResultsCount(data,cb){
       
        let pagination=process.env.PAGINATION;
        let page_count=data.page_count?data.page_count:0;
        let skip=parseInt(page_count) * pagination;
        let checknew = data.new?data.new:0;
        let language_id=data.language_id?data.language_id:0;
        let sqlQuery='';
        if(data.alphabet && data.alphabet!=''){ // for a to z system sorting
            sqlQuery=`SELECT medicines.id ,medicine_translations.name FROM medicines 
            LEFT JOIN medicine_translations ON medicines.id=medicine_translations.medicine_id
            WHERE medicine_translations.name LIKE '${data.alphabet}%' AND medicine_translations.language=${language_id} ORDER BY medicine_translations.name ASC `;
        }else if(data.new && data.new!=''){ //for new medicines
            if(data.search && data.search!=''){
                let search_key=data.search.toUpperCase();
                sqlQuery=`SELECT medicines.id ,medicine_translations.name FROM medicines 
            LEFT JOIN medicine_translations ON medicines.id=medicine_translations.medicine_id
            WHERE medicines.created_at > DATE_SUB(CURDATE(), INTERVAL 1 DAY) 
            AND upper(medicine_translations.name) LIKE '%${search_key}%'
            AND medicine_translations.language=${language_id} ORDER BY medicine_translations.name ASC `;
            }else{
                sqlQuery=`SELECT medicines.id ,medicine_translations.name FROM medicines 
            LEFT JOIN medicine_translations ON medicines.id=medicine_translations.medicine_id
            WHERE medicines.created_at > DATE_SUB(CURDATE(), INTERVAL 1 DAY) 
            AND medicine_translations.language=${language_id} ORDER BY medicine_translations.name ASC `;
            }
        }else if(data.system_id && data.system_id!=''){ //drug by system
            if(data.search && data.search!=''){
                let search_key=data.search.toUpperCase();
                sqlQuery=`SELECT medicines.id ,medicine_translations.name FROM medicines 
            LEFT JOIN medicine_translations ON medicines.id=medicine_translations.medicine_id
            WHERE medicines.med_system_id = ${data.system_id} AND upper(medicine_translations.name) LIKE '%${search_key}%' AND medicine_translations.language=${language_id} ORDER BY medicine_translations.name ASC `;
            }else{
                sqlQuery=`SELECT medicines.id ,medicine_translations.name FROM medicines 
            LEFT JOIN medicine_translations ON medicines.id=medicine_translations.medicine_id
            WHERE medicines.med_system_id = ${data.system_id} AND medicine_translations.language=${language_id} ORDER BY medicine_translations.name ASC `;
            }
            
        }else if(data.brand_id && data.brand_id!=''){ //drug by brand
            if(data.search && data.search!=''){
                let search_key=data.search.toUpperCase();
                sqlQuery=`SELECT medicines.id ,medicine_translations.name FROM medicines 
            LEFT JOIN medicine_translations ON medicines.id=medicine_translations.medicine_id
            WHERE medicines.brand_id = ${data.brand_id} AND upper(medicine_translations.name) LIKE '%${search_key}%'  AND medicine_translations.language=${language_id} ORDER BY medicine_translations.name ASC`;
            }else{
                sqlQuery=`SELECT medicines.id ,medicine_translations.name FROM medicines 
            LEFT JOIN medicine_translations ON medicines.id=medicine_translations.medicine_id
            WHERE medicines.brand_id = ${data.brand_id} AND medicine_translations.language=${language_id} ORDER BY medicine_translations.name ASC`;
            }
            
        }else if(data.disease_id && data.disease_id!=''){ //drug by disease
            if(data.search && data.search!=''){
                let search_key=data.search.toUpperCase();
                sqlQuery=`SELECT medicines.id ,medicine_translations.name FROM medicines 
            LEFT JOIN medicine_translations ON medicines.id=medicine_translations.medicine_id
            WHERE medicines.disease_id = ${data.disease_id} AND upper(medicine_translations.name) LIKE '%${search_key}%' AND medicine_translations.language=${language_id} ORDER BY medicine_translations.name ASC`;
            }else{
                sqlQuery=`SELECT medicines.id ,medicine_translations.name FROM medicines 
            LEFT JOIN medicine_translations ON medicines.id=medicine_translations.medicine_id
            WHERE medicines.disease_id = ${data.disease_id} AND medicine_translations.language=${language_id} ORDER BY medicine_translations.name ASC`;
            }
            
        }else if(data.generic_id && data.generic_id!=''){
            if(data.search && data.search!=''){
                let search_key=data.search.toUpperCase();
                sqlQuery=`SELECT medicines.id ,medicine_translations.name FROM medicines 
            LEFT JOIN medicine_translations ON medicines.id=medicine_translations.medicine_id
            WHERE medicines.generic_name_id = ${data.generic_id} AND upper(medicine_translations.name) LIKE '%${search_key}%' AND medicine_translations.language=${language_id} ORDER BY medicine_translations.name ASC`;
            }else{
                sqlQuery=`SELECT medicines.id ,medicine_translations.name FROM medicines 
            LEFT JOIN medicine_translations ON medicines.id=medicine_translations.medicine_id
            WHERE medicines.generic_name_id = ${data.generic_id} AND medicine_translations.language=${language_id} ORDER BY medicine_translations.name ASC`;
            }
            
        }else if(data.symptom_id && data.symptom_id!=''){
            if(data.search && data.search!=''){
                let search_key=data.search.toUpperCase();
                sqlQuery=`SELECT medicine_symptoms.medicine_id as id,medicine_translations.name FROM medicine_symptoms 
            LEFT JOIN medicine_translations ON medicine_symptoms.medicine_id=medicine_translations.medicine_id
            WHERE medicine_symptoms.symptom_id = ${data.symptom_id} AND upper(medicine_translations.name) LIKE '${search_key}' AND medicine_translations.language=${language_id} ORDER BY medicine_translations.name ASC`;
            }else{
                sqlQuery=`SELECT medicine_symptoms.medicine_id as id,medicine_translations.name FROM medicine_symptoms 
            LEFT JOIN medicine_translations ON medicine_symptoms.medicine_id=medicine_translations.medicine_id
            WHERE medicine_symptoms.symptom_id = ${data.symptom_id} AND medicine_translations.language=${language_id} ORDER BY medicine_translations.name ASC`;
            }
        }
        else if(data.search && data.search!=''){
            let search_key=data.search?data.search.toUpperCase():'';
         sqlQuery=`SELECT medicine_translations.name,medicine_translations.medicine_id FROM medicine_translations WHERE upper(name) LIKE '%${search_key}%' AND medicine_translations.language=${language_id}`;
        }
        else{ // listing all medicines
            sqlQuery=`SELECT medicines.id ,medicine_translations.name FROM medicines 
            LEFT JOIN medicine_translations ON medicines.id=medicine_translations.medicine_id
            WHERE medicine_translations.language=${language_id} ORDER BY medicine_translations.name ASC`; 
        }
        connection.query(sqlQuery,cb);
    }
    static getGenericNames(data,cb){
        let pagination=process.env.PAGINATION;
        let page_count=data.page_count?data.page_count:0;
        let skip=parseInt(page_count) * pagination;
        let language_id=data.language_id?data.language_id:0;
        let search_key=data.search?data.search:'';
        let sqlQuery;
        if(search_key && search_key!=''){
            sqlQuery=`SELECT generic_name_translations.name,generic_names.id FROM generic_names 
                      LEFT JOIN generic_name_translations ON generic_names.id = generic_name_translations.generic_name_id
                      WHERE  generic_name_translations.language=${language_id} AND upper(generic_name_translations.name) LIKE '%${search_key.toUpperCase()}%' LIMIT ${pagination} OFFSET ${skip}`;
        }else{
            sqlQuery=`SELECT generic_name_translations.name,generic_names.id FROM generic_names 
                      LEFT JOIN generic_name_translations ON generic_names.id = generic_name_translations.generic_name_id
                      WHERE  generic_name_translations.language=${language_id} LIMIT ${pagination} OFFSET ${skip}`;
        }
         
       connection.query (sqlQuery,cb);              
    }

    static getGenericNamesCount(data,cb){
        let pagination=process.env.PAGINATION;
        let page_count=data.page_count?data.page_count:0;
        let skip=parseInt(page_count) * pagination;
        let language_id=data.language_id?data.language_id:0;
        let search_key=data.search?data.search:'';
        let sqlQuery;
        if(search_key && search_key!=''){
            sqlQuery=`SELECT generic_name_translations.name,generic_names.id FROM generic_names 
            LEFT JOIN generic_name_translations ON generic_names.id = generic_name_translations.generic_name_id
            WHERE  generic_name_translations.language=${language_id} AND upper(generic_name_translations.name) LIKE '%${search_key.toUpperCase()}%'`;
        }else{
            sqlQuery=`SELECT generic_name_translations.name,generic_names.id FROM generic_names 
            LEFT JOIN generic_name_translations ON generic_names.id = generic_name_translations.generic_name_id
            WHERE  generic_name_translations.language=${language_id}`;
        }
        
       connection.query (sqlQuery,cb);   
    }

    static getSymptomsAccordingToBodyParts(data,cb){
        let pagination=process.env.PAGINATION;
        let page_count=data.page_count?data.page_count:0;
        let skip=parseInt(page_count) * pagination;
        let language_id=data.language_id?data.language_id:1;
        let body_part_id=data.body_part_id?data.body_part_id:'';

        let sqlQuery=`SELECT symptom_translations.name,symptom_translations.symptom_id,symptom_translations.id as translation_id
                      FROM symptom_translations WHERE body_part_id=${body_part_id} AND language=${language_id} LIMIT ${pagination} OFFSET ${skip}`;
        console.log(sqlQuery);  
        connection.query(sqlQuery,cb);              

    }

    static getSymptomsAccordingToBodyPartsCount(data,cb){
        let language_id=data.language_id?data.language_id:1;
        let body_part_id=data.body_part_id?data.body_part_id:'';

        let sqlQuery=`SELECT symptom_translations.name,symptom_translations.symptom_id 
                      FROM symptom_translations WHERE body_part_id=${body_part_id} AND language=${language_id}`;
        connection.query(sqlQuery,cb);  
    }

    //Admin Panel Starts

    static getMedicinesListing(page_count,search_key,cb){
        let pagination=process.env.ADMIN_PAGINATION;
        let skip=parseInt(page_count) * pagination;
        let sqlQuery
        if(search_key!=''){
            sqlQuery=`SELECT medicines.id,medicines.designation_id,medicine_translations.name as medicine_name,medicine_translations.*,
                      generic_name_translations.name as generic_name,brand_translations.name as brand_name,
                      med_system_translations.name as system_name FROM medicines
                      LEFT JOIN medicine_translations ON medicines.id=medicine_translations.medicine_id
                      LEFT JOIN generic_name_translations ON medicines.generic_name_id=generic_name_translations.generic_name_id
                      LEFT JOIN brand_translations ON medicines.brand_id = brand_translations.brand_id
                      LEFT JOIN med_system_translations ON medicines.med_system_id=med_system_translations.med_system_id
                      WHERE med_system_translations.language=1 AND brand_translations.language=1 AND generic_name_translations.language=1
                      AND medicine_translations.language=1 AND upper(medicine_translations.name) LIKE '%${search_key.toUpperCase()}%' OR upper(brand_translations.name) LIKE '%${search_key.toUpperCase()}%' AND med_system_translations.language=1 AND 
                      brand_translations.language=1 AND generic_name_translations.language=1 AND medicine_translations.language=1 OR upper(generic_name_translations.name) LIKE '%${search_key.toUpperCase()}%' AND med_system_translations.language=1 AND 
                      brand_translations.language=1 AND generic_name_translations.language=1 AND medicine_translations.language=1 OR upper(med_system_translations.name) LIKE '%${search_key.toUpperCase()}%' AND med_system_translations.language=1 AND 
                      brand_translations.language=1 AND generic_name_translations.language=1 AND medicine_translations.language=1 ORDER BY medicines.id DESC LIMIT ${pagination} OFFSET ${skip}`;
        }else{
            sqlQuery=`SELECT medicines.id,medicines.designation_id,medicine_translations.name as medicine_name,medicine_translations.*,
                      generic_name_translations.name as generic_name,brand_translations.name as brand_name,
                      med_system_translations.name as system_name FROM medicines
                      LEFT JOIN medicine_translations ON medicines.id=medicine_translations.medicine_id
                      LEFT JOIN generic_name_translations ON medicines.generic_name_id=generic_name_translations.generic_name_id
                      LEFT JOIN brand_translations ON medicines.brand_id = brand_translations.brand_id
                      LEFT JOIN med_system_translations ON medicines.med_system_id=med_system_translations.med_system_id
                      WHERE med_system_translations.language=1 AND brand_translations.language=1 AND generic_name_translations.language=1
                      AND medicine_translations.language=1 ORDER BY medicines.id DESC LIMIT ${pagination} OFFSET ${skip}`;
        }
        connection.query(sqlQuery,cb);              
    }
    static getMedicineListingCount(search_key,cb){
        let sqlQuery;
        if(search_key!=''){
            sqlQuery=`SELECT COUNT(medicines.id) as count FROM medicines
                      LEFT JOIN medicine_translations ON medicines.id=medicine_translations.medicine_id
                      LEFT JOIN generic_name_translations ON medicines.generic_name_id=generic_name_translations.generic_name_id
                      LEFT JOIN brand_translations ON medicines.brand_id = brand_translations.brand_id
                      LEFT JOIN med_system_translations ON medicines.med_system_id=med_system_translations.med_system_id
                      WHERE med_system_translations.language=1 AND brand_translations.language=1 AND generic_name_translations.language=1
                      AND medicine_translations.language=1 AND upper(medicine_translations.name) LIKE '%${search_key.toUpperCase()}%' OR upper(brand_translations.name) LIKE '%${search_key.toUpperCase()}%' AND med_system_translations.language=1 AND 
                      brand_translations.language=1 AND generic_name_translations.language=1 AND medicine_translations.language=1 OR upper(generic_name_translations.name) LIKE '%${search_key.toUpperCase()}%' AND med_system_translations.language=1 AND 
                      brand_translations.language=1 AND generic_name_translations.language=1 AND medicine_translations.language=1 OR upper(med_system_translations.name) LIKE '%${search_key.toUpperCase()}%' AND med_system_translations.language=1 AND 
                      brand_translations.language=1 AND generic_name_translations.language=1 AND medicine_translations.language=1 ORDER BY medicines.id DESC`;
        }else{
            sqlQuery=`SELECT COUNT(medicines.id) as count FROM medicines
                      LEFT JOIN medicine_translations ON medicines.id=medicine_translations.medicine_id
                      LEFT JOIN generic_name_translations ON medicines.generic_name_id=generic_name_translations.generic_name_id
                      LEFT JOIN brand_translations ON medicines.brand_id = brand_translations.brand_id
                      LEFT JOIN med_system_translations ON medicines.med_system_id=med_system_translations.med_system_id
                      WHERE med_system_translations.language=1 AND brand_translations.language=1 AND generic_name_translations.language=1
                      AND medicine_translations.language=1 `;
        }
        connection.query(sqlQuery,cb);  
    }

    static adminMedicineDetail(medicine_id,language_id,cb){
        let  sqlQuery=`SELECT generic_name_translations.name as generic_name,generic_name_translations.generic_name_id,category_translations.name as category,category_translations.category_id,disease_translations.name as indication_name,disease_translations.disease_id as indication_id,
      brand_translations.name as brand_name,brand_translations.brand_id,medicines.id as medicine_id,body_parts.gender as body_gender,body_part_translations.body_part_id,body_part_translations.name as body_part_name,medicines.image,medicine_translations.*,special_instructions.instruction,
      special_instructions.id as instruction_id,medicines.designation_id,designation_translations.name as designation,med_system_translations.name as system_name,med_system_translations.med_system_id FROM medicines 
                      LEFT JOIN medicine_translations ON medicines.id=medicine_translations.medicine_id
                      LEFT JOIN generic_name_translations ON medicines.generic_name_id = generic_name_translations.generic_name_id
                      LEFT JOIN brand_translations ON medicines.brand_id = brand_translations.brand_id
                      LEFT JOIN designation_translations ON medicines.designation_id=designation_translations.designation_id
                      LEFT JOIN med_system_translations ON medicines.med_system_id= med_system_translations.med_system_id
                      LEFT JOIN special_instructions ON medicines.id = special_instructions.medicine_id 
                      LEFT JOIN disease_translations ON medicines.disease_id=disease_translations.disease_id
                      LEFT JOIN category_translations ON medicines.category_id=category_translations.category_id
                      LEFT JOIN body_part_translations ON medicines.body_part_id = body_part_translations.body_part_id
                      LEFT JOIN body_parts ON medicines.body_part_id=body_parts.id
                      WHERE medicines.id =${medicine_id} AND designation_translations.language=1  AND special_instructions.language=${language_id} AND
                      generic_name_translations.language=1  AND brand_translations.language=1 AND disease_translations.language=1
                      AND medicine_translations.language=1 AND category_translations.language=1 AND med_system_translations.language=1`; 
        connection.query(sqlQuery,cb);              
    }

    static getSymptoms(medicine_id,cb){
        let sqlQuery=`SELECT medicine_symptoms.id as medicine_symptom_id,medicine_symptoms.symptom_id,symptom_translations.name,
                      body_parts.gender,body_part_translations.name as body_part_name,body_parts.id as body_part_id FROM medicine_symptoms 
                      LEFT JOIN  symptom_translations ON medicine_symptoms.symptom_id=symptom_translations.id 
                      LEFT JOIN body_part_translations ON symptom_translations.body_part_id=body_part_translations.body_part_id
                      LEFT JOIN body_parts ON symptom_translations.body_part_id=body_parts.id
                      WHERE medicine_symptoms.medicine_id=${medicine_id}  AND symptom_translations.language=1`;
        connection.query(sqlQuery,cb);
    }

    static getAllNotes(medicine_id,designation_id,cb){
        let sqlQuery=`SELECT special_instructions.id,special_instructions.instruction,special_instructions.language FROM special_instructions WHERE medicine_id=${medicine_id} AND designation_id=${designation_id}`;
        connection.query(sqlQuery,cb);
    }

    static getAllClassification(medicine_id,cb){
        let sqlQuery=`SELECT classification,language FROM medicine_translations WHERE medicine_id=${medicine_id}`;
        connection.query(sqlQuery,cb);
    }

    static getAllNotesAccordingToMedicine(medicine_id,cb){
        let sqlQuery=`SELECT special_instructions.id,special_instructions.designation_id,special_instructions.instruction,special_instructions.language FROM special_instructions WHERE medicine_id=${medicine_id}`;
        connection.query(sqlQuery,cb);
    }

    static getSpecialNotesAccordingToDesignation(medicine_id,designation_id,language_id,cb){
       
        let sqlQuery=`SELECT instruction,id as instruction_id FROM special_instructions WHERE medicine_id=? AND designation_id=?`;
        connection.query(sqlQuery,[medicine_id,designation_id],cb);
    }

    static updateSpecialInstructions(id,description,cb){
        let sqlQuery=`UPDATE special_instructions SET instruction=? WHERE id=?`;
        connection.query(sqlQuery,[description,id],cb);
    }

    static createMedicine(inputs,cb){
        let drug_name=inputs.name?inputs.name:'';
        let category=inputs.category_id?inputs.category_id:'';
        let system=inputs.system_id?inputs.system_id:'';
        let body_part=inputs.body_part_id?inputs.body_part_id:'';
        let designation=inputs.designation;
        let image=inputs.image?inputs.image:'';
        // let indication=inputs.indication;
        // let classification=inputs.classification;
        let disease=inputs.indication_id?inputs.indication_id:'';
        let generic=inputs.generic_id?inputs.generic_id:'';
        let brand=inputs.brand_id?inputs.brand_id:'';
        // let special_notes=inputs.special_notes?inputs.special_notes:'';
        // let language_id=inputs.language_id?inputs.language_id:1;
        // let drug_form=inputs.drug_form?inputs.drug_form:'';
        // let symptom_id=inputs.symptom_id?inputs.symptom_id:'';
        let default_designation_id=78;
        let medicine_params=[body_part,category,disease,brand,default_designation_id,system,generic,image];
        let sqlQuery=`INSERT medicines SET body_part_id=?,category_id=?,disease_id=?,brand_id=?,designation_id=?,med_system_id=?,generic_name_id=?,image=?`;
        // let drugQuery=`INSERT medicine_translations SET medicine_id=?,language=?,name=?,symptom=?,drug_form=?,indication=?,classification=?`;
        // let designation_query=`INSERT special_instructions SET medicine_id=?,designation_id=?,language=?,instruction=?`;
        connection.query(sqlQuery,medicine_params,cb);
    }

    static updateMedicine(medicine_id,inputs,cb){
        let drug_name=inputs.name?inputs.name:'';
        let category=inputs.category_id?inputs.category_id:'';
        let system=inputs.system_id?inputs.system_id:'';
        let body_part=inputs.body_part_id?inputs.body_part_id:'';
        let designation=inputs.designation;
        let disease=inputs.indication_id?inputs.indication_id:'';
        let generic=inputs.generic_id?inputs.generic_id:'';
        let brand=inputs.brand_id?inputs.brand_id:'';
        let image=inputs.image?inputs.image:'';
        let indication=inputs.indication?inputs.indication:'';
        let classification=inputs.classification?inputs.classification:'';
        let drug_form=inputs.drug_form?inputs.drug_form:'';
        let language_id=inputs.language_id?inputs.language_id:1;
        // let symptom_id=inputs.symptom_id?inputs.symptom_id:'';
        let sqlQuery;
        let medicine_params;
        console.log(image);
        if(image!=''){
            medicine_params=[body_part,category,disease,brand,system,generic,image,medicine_id];
            sqlQuery=`Update medicines SET body_part_id=?,category_id=?,disease_id=?,brand_id=?,med_system_id=?,generic_name_id=?,image=? WHERE id=?`;
        }else{
            medicine_params=[body_part,category,disease,brand,system,generic,medicine_id];
            sqlQuery=`Update medicines SET body_part_id=?,category_id=?,disease_id=?,brand_id=?,med_system_id=?,generic_name_id=? WHERE id=?`;
        }
         
        // let drugQuery=`Update medicine_translations SET name=?,symptom=?,drug_form=?,indication=?,classification=? WHERE medicine_id=? AND language=?`;
        // let designation_query=`Update special_instructions SET instruction=? WHERE medicine_id=? AND designation_id=? AND language=?`;
        connection.query(sqlQuery,medicine_params,cb);
        // connection.query(sqlQuery,medicine_params,(err,result)=>{
        //     if(err){
        //         console.log(err);
        //     }else{
        //         let designation_params=[special_notes,medicine_id,designation,language_id];
        //         connection.query(designation_query,designation_params,(err,result)=>{
        //             if(err){
        //                 console.log(err);
        //             }
        //         });
        //         let translation_params=[drug_name,'',drug_form,indication,classification,medicine_id,1];
        //         connection.query(drugQuery,translation_params,cb);
        //     }
        // });
    }
    static deleteMedicine(medicine_id,cb){
        let sqlQuery=`DELETE FROM medicines WHERE id=?`;
        connection.query(sqlQuery,[medicine_id],(err,result)=>{
            if(err){

            }else{
                connection.query('DELETE FROM medicine_translations WHERE medicine_id=?',[medicine_id],cb)
            }
        });
    }

    static getSearchedMedicine(user_id,language_id,page_count,cb){
        let pagination=process.env.PAGINATION;
        let skip=parseInt(page_count) * pagination;
        let sqlQuery=`SELECT searched_medicines.medicine_id,medicine_translations.name,
                      disease_translations.name as indication,medicines.created_at FROM searched_medicines
                      LEFT JOIN medicines ON searched_medicines.medicine_id=medicines.id
                      LEFT JOIN medicine_translations ON searched_medicines.medicine_id=medicine_translations.medicine_id
                      LEFT JOIN disease_translations ON medicines.disease_id=disease_translations.disease_id
                      WHERE searched_medicines.user_id=${user_id} AND medicine_translations.language=1 AND disease_translations.language=${language_id} ORDER BY searched_medicines.id DESC LIMIT ${pagination} OFFSET ${skip}`;
        connection.query(sqlQuery,cb);
    }

    static getSearchedMedicineCount(user_id,language_id,cb){
        let sqlQuery=`SELECT COUNT(searched_medicines.medicine_id) as count FROM searched_medicines
                      LEFT JOIN medicines ON searched_medicines.medicine_id=medicines.id
                      LEFT JOIN medicine_translations ON searched_medicines.medicine_id=medicine_translations.medicine_id
                      LEFT JOIN disease_translations ON medicines.disease_id=disease_translations.disease_id
                      WHERE searched_medicines.user_id=${user_id} AND medicine_translations.language=1 AND disease_translations.language=${language_id}`;
        connection.query(sqlQuery,cb);
    }

    static getDesignationAccordingToMedicine(medicine_id,cb){
        let sqlQuery=`SELECT special_instructions.designation_id,designation_translations.name FROM special_instructions
                      LEFT JOIN designation_translations ON special_instructions.designation_id=designation_translations.designation_id
                      WHERE special_instructions.medicine_id=${medicine_id} AND special_instructions.language=1 AND designation_translations.language=1`;
        connection.query(sqlQuery,cb);
    }

    static postCSV(inputs,cb){
       medicines=inputs.medicines;
       medicines.forEach((element)=>{ //medicines loop
            let drug_name=element.name?element.name:'';
            let category=element.category_id?element.category_id:'';
            let system=element.system_id?element.system_id:'';
            let body_part=element.body_part_id?element.body_part_id:'';
            let designation=element.designation;
            let classification=element.classification;
            let image=element.image?element.image:'';
            // let indication=inputs.indication;
            // let classification=inputs.classification;
            let disease=element.indication_id?element.indication_id:'';
            let generic=element.generic_id?element.generic_id:'';
            let brand=element.brand_id?element.brand_id:'';
            // let special_notes=inputs.special_notes?inputs.special_notes:'';
            // let language_id=inputs.language_id?inputs.language_id:1;
            // let drug_form=inputs.drug_form?inputs.drug_form:'';
            // let symptom_id=inputs.symptom_id?inputs.symptom_id:'';
            let medicine_params=[body_part,category,disease,brand,designation[0].id,system,generic,image];
            let sqlQuery=`INSERT medicines SET body_part_id=?,category_id=?,disease_id=?,brand_id=?,designation_id=?,med_system_id=?,generic_name_id=?,image=?`;   
            connection.query(sqlQuery,medicine_params,(err,result)=>{
                if(err){
                    console.log(err)
                }else{
                    let drugQuery=`INSERT medicine_translations SET medicine_id=?,language=?,name=?,symptom=?,drug_form=?,indication=?,classification=?`;
                    let designation_query=`INSERT special_instructions SET medicine_id=?,designation_id=?,language=?,instruction=?`;
                    let symptom_query=`INSERT medicine_symptoms SET medicine_id=?,symptom_id=?`;
                    if(classification){
                        classification.forEach(element => { //making record for classification
                            let translation_params=[result.insertId,element.language_id,drug_name,'',drug_form,'',element.classification];
                            connection.query(drugQuery,translation_params,(err,result)=>{
                                if(err){
                                    console.log(err);
                                }
                            });
                        });
                    }
                    if(designation){
                        designation.forEach(element => { //creating designation records
                            element.notes.forEach(notes=>{
                                let designation_params=[result.insertId,element.id,notes.language_id,notes.special_notes];
                                connection.query(designation_query,designation_params,(err,result)=>{
                                    if(err){
                                        console.log(err);
                                    }
                                });
                            });
                        });
                    }
                    let symptom_params=[result.insertId,element.symptom_id];
                    connection.query(symptom_query,symptom_params,(err,result)=>{
                        if(err){
                            console.log(err);
                        }
                    });
                }
            });
       });
        
        // let drugQuery=`INSERT medicine_translations SET medicine_id=?,language=?,name=?,symptom=?,drug_form=?,indication=?,classification=?`;
        // let designation_query=`INSERT special_instructions SET medicine_id=?,designation_id=?,language=?,instruction=?`;
    }


   
}

module.exports=Medicine;