let Generic=require('../../model/generic');
let Helper=require('../helper/helper');
exports.listGeneric=async function(req,res,next){
    let query=req.query;
    let page_count=query.page_count?query.page_count:0;
    let search_key=query.search_key?query.search_key:'';
    Generic.getgenericListing(page_count,search_key,(err,result)=>{
        if(err){
            console.log(err);
            Helper.getErrorResponse(res,'Server Error!');
        }else{
            if(result.length>0){
                Generic.getGenericListingCount(search_key,(err,count)=>{
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

exports.createGeneric = async function(req,res,next){
    let inputs=req.body;
    let name=inputs.name?inputs.name:'';
    Generic.createGeneric(name,(err,result)=>{
        if(err){
            console.log(err);
            Helper.getErrorResponse(res,'Server Error!');
        }else{
            Helper.getSuccessResponse(res,'Generic Added!');
        }
    });
}

exports.updateGeneric = async function(req,res,next){
    let inputs=req.body;
    let name=inputs.name?inputs.name:'';
    let id=inputs.id?inputs.id:'';
    Generic.updateGeneric(id,name,(err,result)=>{
        if(err){
            Helper.getErrorResponse(res,'Server Error!');
        }else{
            Helper.getSuccessResponse(res,'Generic Updated!');
        }
    });
}

exports.deleteGeneric= async function(req,res,next){
    let inputs=req.body;
    let id=inputs.id?inputs.id:'';
    Generic.deleteGeneric(id,(err,result)=>{
        if(err){
            Helper.getErrorResponse(res,'Server Error!');
        }else{
            Helper.getSuccessResponse(res,'Generic Deleted!');
        }
    });
}