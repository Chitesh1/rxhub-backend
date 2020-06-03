let DesignationSubCat = require('../../model/designation_subcategory');
let Designation = require('../../model/designation');
let Helper = require('../helper/helper');
exports.listSubCategories = (req,res,next)=>{
    let inputs=req.query;
    let page_count=inputs.page_count?inputs.page_count:0;
    let cat_id=inputs.cat_id?inputs.cat_id:'';
    Designation.getDesignationList(cat_id,page_count,(err,result)=>{
        if(err){
            console.log(err);
            Helper.getErrorResponse(res,'Server Error!');
        }else{
            console.log(result);
            if(result.length>0){
                Designation.getDesignationCount(cat_id,(err,count)=>{
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

exports.createSubCategory = (req,res,next)=>{
    let inputs=req.body;
    Designation.addDesignation(inputs,(err,result)=>{
        if(err){
            Helper.getErrorResponse(res,'Server Error!');
        }else{
            Helper.getSuccessResponse(res,'SubCategory Created!');
        }
    });
}

exports.updateSubCategory = (req,res,next)=>{
    let inputs=req.body;
    Designation.editDesignation(inputs.id,inputs.name,inputs.cat_id,(err,result)=>{
        if(err){
            console.log(err);
            Helper.getErrorResponse(res,'Server Error!');
        }else{
            Helper.getSuccessResponse(res,'SubCategory Updated!');
        }
    });
}

exports.deleteSubCategory = (req,res,next)=>{
    let inputs=req.body;
    Designation.deleteDesignation(inputs.id,(err,result)=>{
        if(err){
            Helper.getErrorResponse(res,'Server Error!');
        }else{
            Helper.getSuccessResponse(res,'SubCategory Deleted!');
        }
    });
}