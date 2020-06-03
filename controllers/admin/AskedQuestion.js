let Questions=require('../../model/asked_question');
let Helper=require('../helper/helper');
exports.listQuestions=async function(req,res,next){
    let query=req.query;
    let page_count=query.page_count?query.page_count:0;
    let search_key=query.search_key?query.search_key:'';
    Questions.getQuestionListing(page_count,search_key,(err,result)=>{
        if(err){
            console.log(err);
            Helper.getErrorResponse(res,'Server Error!');
        }else{
            if(result.length>0){
                Questions.getQuestionListingCount(search_key,(err,count)=>{
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

exports.questionDetail = async function(req,res,next){
    let inputs=req.params;
    console.log(req.params);
    let id=inputs.id?inputs.id:'';
    console.log(id);
    Questions.questionDetail(id,(err,result)=>{
        if(err){
            console.log(err);
            Helper.getErrorResponse(res,'Server Error!');
        }else{
           if(result.length>0){
            Helper.getSuccessResponse(res,'',result[0]);
           }else{
               Helper.getErrorResponse(res,'No Data Present');
           }
        }
    });
}

exports.deleteQuestion= async function(req,res,next){
    let inputs=req.body;
    let id=inputs.id?inputs.id:'';
    Questions.deleteQuestion(id,(err,result)=>{
        if(err){
            Helper.getErrorResponse(res,'Server Error!');
        }else{
            Helper.getSuccessResponse(res,'Question Deleted!');
        }
    });
}