let Brand=require('../../model/brand');
let Helper=require('../helper/helper');
exports.listBrands=async function(req,res,next){
    let query=req.query;
    let page_count=query.page_count?query.page_count:0;
    let search_key=query.search_key?query.search_key:'';
    Brand.getBrandListing(page_count,search_key,(err,result)=>{
        if(err){
            console.log(err);
            Helper.getErrorResponse(res,'Server Error!');
        }else{
            if(result.length>0){
                Brand.getBrandListingCount(search_key,(err,count)=>{
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

exports.createBrand = async function(req,res,next){
    let inputs=req.body;
    let name=inputs.name?inputs.name:'';
    Brand.createBrand(name,(err,result)=>{
        if(err){
            console.log(err);
            Helper.getErrorResponse(res,'Server Error!');
        }else{
            Helper.getSuccessResponse(res,'Brand Added!');
        }
    });
}

exports.updateBrand = async function(req,res,next){
    let inputs=req.body;
    let name=inputs.name?inputs.name:'';
    let id=inputs.id?inputs.id:'';
    Brand.updateBrand(id,name,(err,result)=>{
        if(err){
            Helper.getErrorResponse(res,'Server Error!');
        }else{
            Helper.getSuccessResponse(res,'Brand Updated!');
        }
    });
}

exports.deleteBrand= async function(req,res,next){
    let inputs=req.body;
    let id=inputs.id?inputs.id:'';
    Brand.deleteBrand(id,(err,result)=>{
        if(err){
            Helper.getErrorResponse(res,'Server Error!');
        }else{
            Helper.getSuccessResponse(res,'Brand Deleted!');
        }
    });
}