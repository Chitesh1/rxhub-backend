let DesignationCat = require('../../model/designation_category');
let Helper = require('../helper/helper');
exports.listCategories = (req,res,next)=>{
    let inputs=req.query;
    let page_count=inputs.page_count?inputs.page_count:0;
    let search_key=inputs.search_key?inputs.search_key:'';
    DesignationCat.getDesignationCatList(page_count,search_key,(err,result)=>{
        if(err){
            console.log(err);
            Helper.getErrorResponse(res,'Server Error!');
        }else{
            if(result.length>0){
                DesignationCat.getDesignationCatListCount(search_key,(err,count)=>{
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

exports.createCategory = (req,res,next)=>{
    let inputs=req.body;
    DesignationCat.addCategory(inputs,(err,result)=>{
        if(err){
            Helper.getErrorResponse(res,'Server Error!');
        }else{
            Helper.getSuccessResponse(res,'Category Created!');
        }
    });
}

exports.updateCategory = (req,res,next)=>{
    let inputs=req.body;
    DesignationCat.editCategory(inputs.id,inputs.name,(err,result)=>{
        if(err){
            console.log(err);
            Helper.getErrorResponse(res,'Server Error!');
        }else{
            Helper.getSuccessResponse(res,'Category Updated!');
        }
    });
}

exports.deleteCategory = (req,res,next)=>{
    let inputs=req.body;
    DesignationCat.deleteCategories(inputs.id,(err,result)=>{
        if(err){
            Helper.getErrorResponse(res,'Server Error!');
        }else{
            Helper.getSuccessResponse(res,'Category Deleted!');
        }
    });
}