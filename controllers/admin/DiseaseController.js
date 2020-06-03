let Disease = require('../../model/disease');
let Helper = require('../helper/helper');
exports.listDiseases = (req,res,next)=>{
    let inputs=req.query;
    let page_count=inputs.page_count?inputs.page_count:0;
    let search_key=inputs.search_key?inputs.search_key:'';
    Disease.getDiseaseList(page_count,search_key,(err,result)=>{
        if(err){
            console.log(err);
            Helper.getErrorResponse(res,'Server Error!');
        }else{
            if(result.length>0){
                Disease.getDiseaseListCount(search_key,(err,count)=>{
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

exports.createDiseases = (req,res,next)=>{
    let inputs=req.body;
    Disease.addDisease(inputs,(err,result)=>{
        if(err){
            Helper.getErrorResponse(res,'Server Error!');
        }else{
            Helper.getSuccessResponse(res,'Disease Created!');
        }
    });
}

exports.updateDisease = (req,res,next)=>{
    let inputs=req.body;
    Disease.editDisease(inputs.id,inputs.name,(err,result)=>{
        if(err){
            console.log(err);
            Helper.getErrorResponse(res,'Server Error!');
        }else{
            Helper.getSuccessResponse(res,'Disease Updated!');
        }
    });
}

exports.deleteDisease = (req,res,next)=>{
    let inputs=req.body;
    Disease.deleteDisease(inputs.id,(err,result)=>{
        if(err){
            Helper.getErrorResponse(res,'Server Error!');
        }else{
            Helper.getSuccessResponse(res,'Disease Deleted!');
        }
    });
}