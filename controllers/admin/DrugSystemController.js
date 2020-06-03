let System=require('../../model/system');
let Helper=require('../helper/helper');
exports.listDrugSystem=async function(req,res,next){
    let query=req.query;
    let page_count=query.page_count?query.page_count:0;
    let search_key=query.search_key?query.search_key:'';
    System.getSystemListing(page_count,search_key,(err,result)=>{
        if(err){
            console.log(err);
            Helper.getErrorResponse(res,'Server Error!');
        }else{
            if(result.length>0){
                System.getSystemListingCount(search_key,(err,count)=>{
                    if(err){
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

exports.createDrugSystem = async function(req,res,next){
    let inputs=req.body;
    let name=inputs.name?inputs.name:'';
    System.createDrugSystem(name,(err,result)=>{
        if(err){
            console.log(err);
            Helper.getErrorResponse(res,'Server Error!');
        }else{
            Helper.getSuccessResponse(res,'System Added!');
        }
    });
}

exports.updateDrugSystem = async function(req,res,next){
    let inputs=req.body;
    let name=inputs.name?inputs.name:'';
    let id=inputs.id?inputs.id:'';
    System.updateDrugSystem(id,name,(err,result)=>{
        if(err){
            Helper.getErrorResponse(res,'Server Error!');
        }else{
            Helper.getSuccessResponse(res,'System Updated!');
        }
    });
}

exports.deleteDrugSystem= async function(req,res,next){
    let inputs=req.body;
    let id=inputs.id?inputs.id:'';
    System.deleteDrugSystem(id,(err,result)=>{
        if(err){
            Helper.getErrorResponse(res,'Server Error!');
        }else{
            Helper.getSuccessResponse(res,'System Deleted!');
        }
    });
}