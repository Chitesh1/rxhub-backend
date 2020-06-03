let Symptom = require('../../model/symptom');
let Helper = require('../helper/helper');
let connection=require('../../model/connection');
exports.listSymptoms = (req,res,next)=>{
    let inputs=req.query;
    let page_count=inputs.page_count?inputs.page_count:0;
    Symptom.getSymptomList(page_count,(err,result)=>{
        if(err){
            console.log(err);
            Helper.getErrorResponse(res,'Server Error!');
        }else{
            if(result.length>0){
                Symptom.getSymptomListCount((err,count)=>{
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

exports.createSymptoms = (req,res,next)=>{
    let inputs=req.body;
    console.log(inputs);
    let symptom=`INSERT symptom SET id=NULL`;
        connection.query(symptom,(err,result)=>{
            if(err){
                console.log(err);
                Helper.getErrorResponse(res,'Server Error!');
            }else{
                inputs.body_part_id.forEach(bodypart => {
                    //creating symptoms
                    
                    let symptom_translations=`INSERT INTO symptom_translations (symptom_id,body_part_id,language,name) VALUES ?`;
                    let values=[];
                    inputs.symptom.forEach(symptom=>{
                        
                        values.push([result.insertId,bodypart.id,1,symptom.name]);
                    });
                   
                    connection.query(symptom_translations,[values],(err,check)=>{
                        if(err){
                            console.log(err);
                            Helper.getErrorResponse(res,'Server Error!');
                        }
                    });     
                });
                Helper.getSuccessResponse(res,'Symptoms Added!');
            }
        });    
    
    // Symptom.addSymptom(inputs,(err,result)=>{
    //     if(err){
    //         console.log(err);
    //         Helper.getErrorResponse(res,'Server Error!');
    //     }else{
    //         Helper.getSuccessResponse(res,'Symptoms Created!');
    //     }
    // });
}

exports.updateSymptoms = (req,res,next)=>{
    let inputs=req.body;
    Symptom.editSymptom(inputs.translation_id,inputs.body_part_id,inputs.name,(err,result)=>{
        if(err){
            console.log(err);
            Helper.getErrorResponse(res,'Server Error!');
        }else{
            Helper.getSuccessResponse(res,'Symptom Updated!');
        }
    });
}

exports.deleteSymptoms = (req,res,next)=>{
    let inputs=req.body;
 
    Symptom.deleteSymptom(inputs.symptom_id,(err,result)=>{
        if(err){
            console.log(err);
            Helper.getErrorResponse(res,'Server Error!');
        }else{
            Helper.getSuccessResponse(res,'Symptom Deleted!');
        }
    });
}