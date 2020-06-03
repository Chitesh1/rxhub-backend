let Medicine = require('../../model/medicine');
let BodyPart = require('../../model/bodyparts');
let Brand = require('../../model/brand');
let Category = require('../../model/category');
let Designation = require('../../model/designation');
let System = require('../../model/system');
let Generic = require('../../model/generic');
let Disease = require('../../model/disease');
let Helper = require('../helper/helper');
let Symptom=require('../../model/symptom');
let connection=require('../../model/connection');
exports.listMedicines = (req,res,next)=>{
    let inputs=req.query;
    let page_count=inputs.page_count?inputs.page_count:0;
    let search_key=inputs.search_key?inputs.search_key:'';
    Medicine.getMedicinesListing(page_count,search_key,(err,result)=>{
        if(err){
            console.log(err);
            Helper.getErrorResponse(res,'Server Error!');
        }else{
            if(result.length>0){
                Medicine.getMedicineListingCount(search_key,(err,count)=>{
                    if(err){
                        console.log(err);
                        Helper.getErrorResponse(res,'Server Error!');
                    }else{
                        Helper.getListingResponse(res,count[0].count,result);
                    }
                });
            }else{
                Helper.getListingResponse(res,0,[]);
            }
        }
    });
}

exports.createMedicine = (req,res,next)=>{
    let inputs=req.body;
    let designation=inputs.designation;
    let classification=inputs.classification;
    let body_part_id=inputs.body_part_id;
    let symptoms=inputs.symptoms;
    let drug_name=inputs.name?inputs.name:'';
     let drug_form=inputs.drug_form?inputs.drug_form:'';
     console.log(inputs);
    Medicine.createMedicine(inputs,(err,result)=>{
        if(err){
            console.log(err);
            Helper.getErrorResponse(res,'Server Error!');
        }else{
            let drugQuery=`INSERT medicine_translations SET medicine_id=?,language=?,name=?,symptom=?,drug_form=?,indication=?,classification=?`;
            let designation_query=`INSERT special_instructions SET medicine_id=?,designation_id=?,language=?,instruction=?`;
            let symptom_query=`INSERT medicine_symptoms SET medicine_id=?,symptom_id=?`;
            let body_part_query=`INSERT drug_body_parts SET medicine_id=?,body_part_id=?`;
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
            if(symptoms && symptoms.length>0){
                symptoms.forEach(element=>{
                    let symptom_params=[result.insertId,element.symptom_id];
                    connection.query(symptom_query,symptom_params,(err,result)=>{
                        if(err){
                            console.log(err);
                        }
                    });
                });
            }
            // if(body_part_id){
            //     body_part_id.forEach(element=>{
            //         let bodypartParams=[result.insertId,element.id];
            //         connection.query(body_part_query,bodypartParams,(err,result)=>{
            //             if(err){
            //                 console.log(err);
            //             }
            //         });
            //     });
            // } 
            Helper.getSuccessResponse(res,'Medicine Created!');
        }
    });
}

exports.postCSV=(req,res,next)=>{
    let inputs=req.body;
    medicines=inputs.medicines;
       medicines.forEach((element)=>{ //medicines loop
            let drug_name=element.name?element.name:'';
            let category=element.category_id?element.category_id:'';
            let system=element.system_id?element.system_id:'';
            let body_part=element.body_part_id?element.body_part_id:'';
            let designation=element.designation;
            let designation_id=designation[0].id?designation[0].id:'';
            let classification=element.classification;
            let image=element.image?element.image:'';
            // let indication=inputs.indication;
            // let classification=inputs.classification;
            let disease=element.indication_id?element.indication_id:'';
            let generic=element.generic_id?element.generic_id:'';
            let brand=element.brand_id?element.brand_id:'';
            // let special_notes=inputs.special_notes?inputs.special_notes:'';
            // let language_id=inputs.language_id?inputs.language_id:1;
            let drug_form=inputs.drug_form?inputs.drug_form:'';
            // let symptom_id=inputs.symptom_id?inputs.symptom_id:'';
            let default_designation_id=78;
            
            let medicine_params=[body_part,category,disease,brand,default_designation_id,system,generic,image];
            let sqlQuery=`INSERT medicines SET body_part_id=?,category_id=?,disease_id=?,brand_id=?,designation_id=?,med_system_id=?,generic_name_id=?,image=?`;   
            connection.query(sqlQuery,medicine_params,(err,result)=>{
                if(err){
                    console.log(err);
                    Helper.getErrorResponse(res,'Server Error!');
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
                                    Helper.getErrorResponse(res,'Server Error!');
                                }
                            });
                        });
                    }
                    if(designation){
                        designation.forEach(element => { //creating designation records
                            element.notes.forEach(notes=>{
                                let designation_params=[result.insertId,default_designation_id,notes.language_id,notes.special_notes];
                                connection.query(designation_query,designation_params,(err,result)=>{
                                    if(err){
                                        console.log(err);
                                        Helper.getErrorResponse(res,'Server Error!');
                                    }
                                });
                            });
                        });
                    }
                    let symptom_params=[result.insertId,element.symptom_id];
                    connection.query(symptom_query,symptom_params,(err,result)=>{
                        if(err){
                            console.log(err);
                            Helper.getErrorResponse(res,'Server Error!');
                        }
                    });
                }
            });
       });
       Helper.getSuccessResponse(res,'Medicines Added!');
}

exports.updateMedicine = (req,res,next)=>{
    let inputs=req.body;
    let drug_name=inputs.name?inputs.name:'';
    let drug_form=inputs.drug_form?inputs.drug_form:'';
    let medicine_id=inputs.medicine_id?inputs.medicine_id:'';
    let symptoms=inputs.symptoms;
    let designation=inputs.designation;
    let classification=inputs.classification;
    console.log(medicine_id);
    Medicine.updateMedicine(medicine_id,inputs,(err,result)=>{
        if(err){
            console.log(err);
            Helper.getErrorResponse(res,'Server Error!');
        }else{
            let drugQuery=`UPDATE medicine_translations SET language=?,name=?,symptom=?,drug_form=?,indication=?,classification=? WHERE medicine_id=? AND language=?`;
            let designation_query=`UPDATE special_instructions SET language=?,instruction=? WHERE medicine_id=? AND language=? AND designation_id=?`;
            let symptom_query=`UPDATE medicine_symptoms SET symptom_id=? WHERE id=?`;
            let new_symptom_query=`INSERT medicine_symptoms SET symptom_id=?,medicine_id=?`;
            if(classification){
                classification.forEach(element => { //making record for classification
                    let translation_params=[element.language_id,drug_name,'',drug_form,'',element.classification,medicine_id,element.language_id];
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
                        let designation_params=[notes.language_id,notes.special_notes,medicine_id,notes.language_id,element.id];
                        connection.query(designation_query,designation_params,(err,result)=>{
                            if(err){
                                console.log(err);
                            }
                        });
                    });
                });
            }
            if(symptoms){
                symptoms.forEach(element=>{
                    console.log(element);
                    if(element.medicine_symptom_id!=''){
                        
                       
                        let symptom_params=[element.symptom_id,element.medicine_symptom_id];
                        connection.query(symptom_query,symptom_params,(err,result)=>{
                            if(err){
                                console.log(err);
                            }
                        });
                    }else{
                       
                        let insert_symptom_params=[element.symptom_id,medicine_id];
                        connection.query(new_symptom_query,insert_symptom_params,(err,result)=>{
                            if(err){
                                console.log(err);
                            }
                        });
                    }
                    
                });
            }  
            Helper.getSuccessResponse(res,'Medicine Updated!');
        }
    });
};

exports.deleteMedicine = (req,res,next)=>{
    let inputs=req.body;
    let ids=inputs.medicine_id;
    ids.forEach(element=>{
        let sqlQuery=`DELETE FROM medicines WHERE id=?`;
        connection.query(sqlQuery,[element.id],(err,result)=>{
            if(err){
                console.log(err);
            }else{
                connection.query('DELETE FROM medicine_translations WHERE medicine_id=?',[element.id],(err,result)=>{
                    if(err){
                        console.log(err);
                    }
                })
            }
        });
       
    });
    Helper.getSuccessResponse(res,'Medicines Deleted!');
    
}

exports.medicineDetail = (req,res,next)=>{
    let params=req.params;
    let medicine_id=params.medicine_id?params.medicine_id:'';
    let designation_id=req.query.designation_id?req.query.designation_id:'';
    let language_id=req.query.language_id?req.query.language_id:1;
    Medicine.adminMedicineDetail(medicine_id,language_id,(err,result)=>{
        if(err){
            console.log(err);
            Helper.getErrorResponse(res,'Server Error!');
        }else{
            if(result.length>0){
                if(designation_id!=''){
                    Medicine.getSpecialNotesAccordingToDesignation(medicine_id,designation_id,language_id,(err,notes)=>{
                        if(err){
                            Helper.getErrorResponse(res,'Server Error!');
                        }else{
                            Medicine.getAllNotes(medicine_id,result[0].designation_id,(err,designation)=>{
                                    if(err){
                                        console.log(err);
                                    }else{
                                        Medicine.getAllClassification(medicine_id,(err,classification)=>{
                                            if(err){
                                                console.log(err);
                                            }else{
                                                Medicine.getSymptoms(medicine_id,(err,symptoms)=>{
                                                    if(err){
                                                        console.log(err);
                                                    }
                                                    if(notes.length>0){
                                                        let special_notes={'instruction_id':notes[0].instruction_id,'instruction':notes[0].instruction};
                                                        res.status(200).json({'drug_detail':result[0],'designation':designation,'classification':classification,'special_notes':notes,'symptoms':symptoms});
                                                       }else{
                                                        let special_notes={'instruction_id':'','instruction':''};
                                                        res.status(200).json({'drug_detail':result[0],'designation':designation,'classification':classification,'special_notes':special_notes,'symptoms':symptoms});
                                                       }
                                                });
                                            }
                                        });
                                    }
                            });
                        }
                    });
                }else{
                    Medicine.getAllNotes(medicine_id,result[0].designation_id,(err,notes)=>{
                        let designation_notes;
                        let classfi;
                        if(err){
                            console.log(err);
                        }else{
                            if(notes.length>0){
                                Medicine.getAllClassification(medicine_id,(err,classification)=>{
                                    if(err){
                                        console.log(err);
                                    }
                                    classfi=classification;
                                    designation_notes=notes;
                                    designation_notes;
                                    Medicine.getSymptoms(medicine_id,(err,symptoms)=>{
                                        if(err){
                                            console.log(err);
                                        }
                                        let special_notes={'instruction_id':result[0].instruction_id,'instruction':result[0].instruction};
                                    res.status(200).json({'drug_detail':result[0],'designation':designation_notes,'classification':classfi,'special_notes':notes,'symptoms':symptoms});
                                    });
                                    
                                });   
                            }else{
                                designation_notes=[];
                            }
                           
                        }
                    });
                    
                }
                
            }else{
                Helper.getErrorResponse(res,'Not Found!');
            }
        }
    });
}

exports.updateSpecialInstruction = (req,res,next)=>{
    let inputs=req.body;
    let instruction_id=inputs.id?inputs.id:'';
    let description=inputs.description?inputs.description:'';
    Medicine.updateSpecialInstructions(instruction_id,description,(err,result)=>{
        if(err){
            console.log(err);
            Helper.getErrorResponse(res,'Server Error!');
        }else{
            Helper.getSuccessResponse(res,'Instruction Updated!');
        }
    });    
    
}

exports.getAllDesignation = (req,res,next)=>{
    let params=req.params;
    Medicine.getAllNotesAccordingToMedicine(params.id,(err,result)=>{
        if(err){
            console.log(err);
            Helper.getErrorResponse(res,'Server Error!');
        }else{
            if(result.length>0){
                Helper.getListingResponse(res,result.length,result);
            }else{
                Helper.getListingResponse(res,0,[]);
            }
        }
    });
};

exports.getList=(req,res,next)=>{
    let query=req.query;
    let gender=query.gender?query.gender:'';
    let body_part_id=query.body_part_id?query.body_part_id:'';    
    Category.getCategoryListingWithoutPagination((err,category)=>{
        console.log(category);
        System.getSystemListingWithoutPagination((err,system)=>{
            console.log(system)
            BodyPart.getBodyPartListingWithoutPaginations(gender,(err,body_part)=>{
                console.log(body_part);
                Designation.getDesignationListWithoutPagination((err,designation)=>{
                   
                    Generic.getgenericListingWithoutPagination((err,generic)=>{
                        
                        Brand.getBrandListingWithoutPagination((err,brand)=>{
                        
                            Disease.getDiseaseListWithoutPagination((err,indication)=>{
                                Symptom.getSymptomListAccordingToBodyPart(async (err,symptoms)=>{
                                    if(err){
                                        console.log(err);
                                    }else{
                                        res.json({'category':category,'system':system,'body_part':body_part,'designation':designation,'generic':generic,'brand':brand,'symptoms':symptoms,'indication':indication});   
                                    }
                                });
                                
                            });
                        });
                    });
                });
            });
        });
    });
}

exports.selectedDesignations= (req,res,next)=>{
    Medicine.getDesignationAccordingToMedicine(req.params.id,(err,result)=>{
        if(err){
            console.log(err);
            Helper.getErrorResponse(res,'Server Error!');
        }else{
            if(result.length>0){
                Helper.getListingResponse(res,result.length,result);
            }else{
                Helper.getListingResponse(res,0,[]);
            }
        }
    });  
};

exports.getSymptoms=(req,res,next)=>{
    Symptom.getSymptomListAccordingToBodyPart(async (err,symptoms)=>{
        if(err){
            console.log(err);
        }else{
            
            let newsymptoms=[];
            let count=0;
            let ids=[];
            symptoms.forEach(async element=>{
               
               
                let sqlQuery=`SELECT symptom_translations.body_part_id,body_part_translations.name,body_parts.gender FROM symptom_translations 
                              LEFT JOIN body_parts ON symptom_translations.body_part_id=body_parts.id
                              LEFT JOIN body_part_translations ON symptom_translations.body_part_id=body_part_translations.body_part_id
                              WHERE symptom_translations.symptom_id = ${element.id} AND symptom_translations.language=1 AND body_part_translations.language=1`;
                await connection.query(sqlQuery,(err,result)=>{
                    if(err){
                        console.log(err);
                    }else{ 
                        count++;
                            newsymptoms.push({'id':element.id,'name':element.name,'translation_id':element.translation_id,'body_parts':result})
                        if(count==symptoms.length){
                            res.json({newsymptoms});
                        }
                    //     console.log(count);
                   
                    //    if(count==symptoms.length){
                    //        res.json({newsymptoms});
                    //    } 
                    }
                });
            });   
        }
    });
};