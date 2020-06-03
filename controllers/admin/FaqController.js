let Faq=require('../../model/faq');
let Helper=require('../helper/helper');

exports.listFaq = (req,res,next)=>{
    let inputs=req.query;
    let page_count=inputs.page_count?inputs.page_count:0;
    let search_key=inputs.search_key?inputs.search_key:'';
    Faq.getfaqListing(page_count,search_key,(err,result)=>{
        if(err){
            Helper.getErrorResponse(res,'Server Error!');
        }else{
            if(result.length>0){    
                Faq.getFaqListingCount(search_key,(err,count)=>{
                    Helper.getListingResponse(res,count[0].count,result);
                });
            }else{
                Helper.getListingResponse(res,0,[]);
            }
        }
    });
}

exports.postFaq = (req,res,next)=>{
    let inputs=req.body;
    Faq.createFaq(inputs,(err,result)=>{
        if(err){
            Helper.getErrorResponse(res,'Server Error!');
        }else{
            Helper.getSuccessResponse(res,'Faq Posted!');
        }
    });
}

exports.viewFaq = (req,res,next)=>{

}

exports.deleteFaq = (req,res,next)=>{
    let inputs=req.body;
    let faq_id=inputs.id?inputs.id:'';
    Faq.deleteFaq(faq_id,(err,result)=>{
        if(err){
            Helper.getErrorResponse(res,'Server Error!');
        }else{
            Helper.getSuccessResponse(res,'Faq Deleted!');
        }
    });
}

exports.updateFaq = (req,res,next)=>{
    let inputs=req.body;
    let faq_id=inputs.id?inputs.id:'';

    Faq.updateFaq(faq_id,inputs,(err,result)=>{
        if(err){
            Helper.getErrorResponse(res,'Server Error!');
        }else{
            Helper.getSuccessResponse(res,'Faq Updated!');
        }
    });
}