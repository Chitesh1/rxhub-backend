
let User=require('../../model/user');
let Helper=require('../helper/helper');
exports.getUserListing = async function(req,res,next){
    let query=req.query;
    User.userListing(query,(err,result)=>{
        if(err){
            console.log(err);
            Helper.getErrorResponse(res,'Server Error!','db',err);
        }else{
            if(result.length>0){
                console.log(result);
                User.userListingCount(query,(err,count)=>{
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

exports.getAllUserListing = async function(req,res,next){
    let query=req.query;
    User.userListingAll((err,result)=>{
        if(err){
            console.log(err);
            Helper.getErrorResponse(res,'Server Error!','db',err);
        }else{
            if(result.length>0){
                
                Helper.getListingResponse(res,result.length,result);
                    
               
            }else{
                Helper.getListingResponse(res,0,[]);
            }
        }
    });
}

exports.getUserDetail = async function(req,res,next){
    let params=req.params;
    console.log(params.id);
    let query=req.query;
    let language_id=query.language_id?query.language_id:1;
    let page_count=query.page_count?query.page_count:0;
    User.userDetail(params,language_id,(err,user)=>{
        if(err){
            console.log(err);
            Helper.getErrorResponse(res,'Server Error!');
        }else{
            console.log(user);
            if(user.length>0){
                User.getRecentlyBrowsedMedicines(page_count,params.id,language_id,(err,medicines)=>{
                    if(err){
                        console.log(err)
                        Helper.getErrorResponse(res,'Server Error!');
                    }else{
                        User.getRecentlyBrowsedMedicinesCount(params.id,language_id,(err,medicine_count)=>{
                            if(err){
                                console.log(err);
                                Helper.getErrorResponse(res,'Server Error!');
                            }
                            let count=medicine_count[0].count?medicine_count[0].count:0;
                            User.getUserInquiries(params.id,(err,inquiry)=>{
                                if(err){
                                    console.log(err)
                                    Helper.getErrorResponse(res,'Server Error!');
                                }else{
                                    User.getAskedQuestions(params.id,language_id,(err,questions)=>{
                                        if(err){
                                            console.log(err)
                                            Helper.getErrorResponse(res,'Server Error!');
                                        }else{
                                           res.status(200).json({'user_detail':user[0],'medicine_count':count,'searched_medicines':medicines,'enquiries':inquiry,'question':questions}) 
                                        }
                                    })
                                }
                            });
                        });
                    }
                });
            }else{
                Helper.getErrorResponse(res,'Detail not Found or may be Designation is not set');
            }
        }
    });

}

exports.updateUserStatus = async function(req,res,next){
    let inputs=req.body;
    let user_id=inputs.user_id?inputs.user_id:'';
    let status=inputs.status?inputs.status:'';

    console.log(inputs);
    if(user_id!='' || status !=''){
        User.updateUserStatus(user_id,inputs.status,(err,result)=>{
            if(err){
                console.log(err);
                Helper.getErrorResponse(res,'Server Error!');
            }else{
               if(result.affectedRows==1){
                Helper.getSuccessResponse(res,'Record updated!');
               }else{
                   Helper.getErrorResponse(res,'Record Not updated');
               }
            }
        });
    }else{
        Helper.getErrorResponse(res,'Please Enter required Fields');
    }
    
}