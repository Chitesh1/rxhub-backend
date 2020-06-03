let Designation = require('../../model/designation');
let Helper = require('../helper/helper');
exports.listDesignation = (req,res,next)=>{
    let inputs=req.query;
    let page_count=inputs.page_count?inputs.page_count:0;
    let cat_id=inputs.cat_id?inputs.cat_id:'';
    let search_key=inputs.search_key?inputs.search_key:'';
    
    Designation.getDesignationList(cat_id,page_count,search_key,(err,result)=>{
        if(err){
            console.log(err);
            Helper.getErrorResponse(res,'Server Error!');
        }else{
            if(result.length>0){
                Designation.getDesignationCount(cat_id,search_key,(err,count)=>{
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

exports.createDesignation = (req,res,next)=>{
    let inputs=req.body;
    Designation.addDesignation(inputs,(err,result)=>{
        if(err){
            console.log(err);
            Helper.getErrorResponse(res,'Server Error!');
        }else{
            Helper.getSuccessResponse(res,'Designation Created!');
        }
    });
}

exports.updateDesignation = (req,res,next)=>{
    let inputs=req.body;
    Designation.editDesignation(inputs.id,inputs.name,inputs.designation_category_id,(err,result)=>{
        if(err){
            console.log(err);
            Helper.getErrorResponse(res,'Server Error!');
        }else{
            Helper.getSuccessResponse(res,'Designation Updated!');
        }
    });
}

exports.deleteDesignation = (req,res,next)=>{
    let inputs=req.body;
    Designation.deleteDesignation(inputs.id,(err,result)=>{
        if(err){
            Helper.getErrorResponse(res,'Server Error!');
        }else{
            Helper.getSuccessResponse(res,'Designation Deleted!');
        }
    });
}