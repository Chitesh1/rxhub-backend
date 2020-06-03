let Medicine= require('../../model/medicine');
require('dotenv').config();
let Helper = require('../helper/helper');

exports.system=async function(req,res,next){  //system listing
    let inputs=req.body;
    let query=req.query;
    let type=0;
    Medicine.listMedicines(query,type,(err,result)=>{
        if(err){
            Helper.getErrorResponse(res,'Problem With Query!','db',err);
        }else{
            if(result.length>0){
                Medicine.listMedicinesCount(query,type,(err,count)=>{
                    if(err){
                        Helper.getErrorResponse(res,'Server Error!','db',err);
                    }else{
                        Helper.getListingResponse(res,count.length,result);
                    }
                });
            }else{
                Helper.getListingResponse(res,0,[]);
            }
        }
    });
}

exports.brand=async function(req,res,next){ // brand listing
    let inputs=req.body;
    let query=req.query;
    let type=3; //brand
    Medicine.listMedicines(query,type,(err,result)=>{
        if(err){
            Helper.getErrorResponse(res,'Problem With Query!','db',err);
        }else{
            if(result.length>0){
                Medicine.listMedicinesCount(query,type,(err,count)=>{
                    if(err){
                        Helper.getErrorResponse(res,'Server Error!','db',err);
                    }else{
                        Helper.getListingResponse(res,count.length,result);
                    }
                });
                
            }else{
                Helper.getListingResponse(res,0,[]);
            }
        }
    });
}

exports.disease=async function(req,res,next){ //Disease listing
    let inputs=req.body;
    let query=req.query;
    let type=2; //brand
    Medicine.listMedicines(query,type,(err,result)=>{
        if(err){
            Helper.getErrorResponse(res,'Problem With Query!','db',err);
        }else{
            if(result.length>0){
                Medicine.listMedicinesCount(query,type,(err,count)=>{
                    if(err){
                        Helper.getErrorResponse(res,'Server Error!','db',err);
                    }else{
                        Helper.getListingResponse(res,count.length,result);
                    }
                });
            }else{
                Helper.getListingResponse(res,0,[]);
            }
        }
    });
}

exports.bodyParts=async function(req,res,next){ //body parts listing
    let inputs=req.body;
    let query=req.query;
    console.log(req.query);
    let type=5; //brand
    Medicine.listMedicines(query,type,(err,result)=>{
        if(err){
            Helper.getErrorResponse(res,'Problem With Query!','db',err);
        }else{
            if(result.length>0){
                Medicine.listMedicinesCount(query,type,(err,count)=>{
                    if(err){
                        Helper.getErrorResponse(res,'Server Error!','db',err);
                    }else{
                        Helper.getListingResponse(res,count.length,result);
                    }
                });
                
            }else{
                Helper.getListingResponse(res,0,[]);
            }
        }
    });
}

exports.symptoms = async function(req,res,next){ //symptom listing
    let query=req.query;
    console.log(query);
    Medicine.getSymptomsAccordingToBodyParts(query,(err,result)=>{
        if(err){
            Helper.getErrorResponse(res,'Server Error!','db',err);
        }else{
            console.log(result);
            if(result.length>0){ 
                console.log(result);
                Medicine.getSymptomsAccordingToBodyPartsCount(query,(err,count)=>{ //getting count
                    if(err){
                        Helper.getErrorResponse(res,'Server Error!','db',err);
                    }else{
                        Helper.getListingResponse(res,count.length,result);
                    }
                });
            }else{
                Helper.getListingResponse(res,0,[]);
            }
        }
    });
}

exports.detailMedicines=async function(req,res,next){ //medicine detail
    let params=req.params;
    let id=params.medicine_id?params.medicine_id:'';
    Medicine.newDetailMedicine(req,(err,result)=>{
        if(err){
            console.log(err);
            Helper.getErrorResponse(res,'Problem With Query!','db',err);
        }else{
            if(result.length>0){
                Medicine.createConsumptionRecord(req.user.id,id);
                Medicine.getMobileNotes(req,result[0].designation_id,(err,notes)=>{
                    Medicine.getMobileClassfication(req,(err,classification)=>{
                        if(classification.length>0){
                            result[0].classification=classification[0].classification;
                        }else{
                            result[0].classification='';
                        }
                        if(notes.length>0){
                            result[0].instruction=notes[0].instruction;
                        }else{
                            result[0].instruction='';
                        }
                          // result[0].classification=result[0].classification?result[0].classification:"";
                    // result[0].instruction=notes[0].instruction?notes[0].instruction:'';
                    Helper.getSuccessResponse(res,'',result[0]);
                    });
                });
                
            }else{
                Helper.getErrorResponse(res,'Detail not found!');
            }
        }
    });
}


exports.filteredResults=async function(req,res,next){ //listing medicines 
    let params=req.query;
    console.log(params);
    if(req.query.page_count!='' && req.query.language_id!=''){
        Medicine.getFilteredResults(params,req.user.id,(err,result)=>{
            if(err){
                Helper.getErrorResponse(res,'Problem With Query!','db',err);
            }else{
                if(result.length>0){
                    Medicine.getFilteredResultsCount(params,(err,count)=>{
                        if(err){
                            Helper.getErrorResponse(res,'Server Error!','db',err);
                        }else{
                            Helper.getListingResponse(res,count.length,result);
                        }
                    });
                    
                }else{
                    Helper.getListingResponse(res,0,[]);
                }
            }
        }); 
    }else{
        Helper.getErrorResponse(res,'Page Count and language is required');
    }  
}


exports.genericNames=async function(req,res,next){ //generic name listing
    let query=req.query;
    Medicine.getGenericNames(query,(err,result)=>{
        if(err){
            Helper.getErrorResponse(res,'Server Error!','db',err);
        }else{
            if(result.length>0){
                Medicine.getGenericNamesCount(query,(err,count)=>{
                    if(err){
                        Helper.getErrorResponse(res,'Server Error!','db',err)
                    }else{
                        Helper.getListingResponse(res,count.length,result);
                    }
                });  
            }else{
                Helper.getListingResponse(res,0,[]);
            }
        }
    });
}

exports.getRecentlySearchedMedicines = async function(req,res,next){
    let query=req.query;
    let language_id=query.language_id?query.language_id:'';
    let page_count=query.page_count?query.page_count:'';
    Medicine.getSearchedMedicine(req.user.id,language_id,page_count,(err,result)=>{
        if(err){
            console.log(err);
            Helper.getErrorResponse(res,'Server Error!');
        }else{
            console.log(result);
            if(result.length>0){
                Medicine.getSearchedMedicineCount(req.user.id,language_id,(err,count)=>{
                    if(err){
                        console.log(err);
                    }else{
                        console.log(count);
                        Helper.getListingResponse(res,count[0].count,result);    
                    }
                });
            }else{
                Helper.getListingResponse(res,0,[]);
            }
        }
    });
}