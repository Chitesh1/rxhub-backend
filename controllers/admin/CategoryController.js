let Category=require('../../model/category');
let Helper=require('../helper/helper');
exports.listCategories=async function(req,res,next){
    let query=req.query;
    let page_count=query.page_count?query.page_count:0;
    let search_key=query.search_key?query.search_key:'';
    Category.getCategoryListing(page_count,search_key,(err,result)=>{
        if(err){
            console.log(err);
            Helper.getErrorResponse(res,'Server Error!');
        }else{
            if(result.length>0){
                Category.getCategoryListingCount(search_key,(err,count)=>{
                    if(err){
                        console.log(err);
                        Helper.getErrorResponse(res,'Server Error!');
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

exports.listClassification=async function(req,res,next){
    let query=req.query;
    let page_count=query.page_count?query.page_count:0;
    Category.getClassificationListing((err,result)=>{
        if(err){
            console.log(err);
            Helper.getErrorResponse(res,'Server Error!');
        }else{
            console.log(result)
            if(result.length>0){
                Helper.getListingResponse(res,result.length,result);
            }else{
                Helper.getListingResponse(res,0,[]);
            }
        }
    });
}

exports.createCategory = async function(req,res,next){
    let inputs=req.body;
    let name=inputs.name?inputs.name:'';
    Category.createCategory(name,(err,result)=>{
        if(err){
            console.log(err);
            Helper.getErrorResponse(res,'Server Error!');
        }else{
            Helper.getSuccessResponse(res,'Category Added!');
        }
    });
}

exports.updateCategory = async function(req,res,next){
    let inputs=req.body;
    let name=inputs.name?inputs.name:'';
    let id=inputs.id?inputs.id:'';
    Category.updateCategory(id,name,(err,result)=>{
        if(err){
            Helper.getErrorResponse(res,'Server Error!');
        }else{
            Helper.getSuccessResponse(res,'Category Updated!');
        }
    });
}

exports.deleteCategory= async function(req,res,next){
    let inputs=req.body;
    let id=inputs.id?inputs.id:'';
    Category.deleteCategory(id,(err,result)=>{
        if(err){
            Helper.getErrorResponse(res,'Server Error!');
        }else{
            Helper.getSuccessResponse(res,'Category Deleted!');
        }
    });
}