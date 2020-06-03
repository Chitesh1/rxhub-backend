let BodyParts=require('../../model/bodyparts');
let Helper=require('../helper/helper');
let connection = require('../../model/connection');
exports.listBodyParts=(req,res,next)=>{
    let inputs=req.query;
    let page_count=inputs.page_count?inputs.page_count:0;
    let search_key=inputs.search_key?inputs.search_key:'';
    let filter=inputs.filter?inputs.filter:'';
    BodyParts.getBodyParts(page_count,search_key,filter,(err,result)=>{
        if(err){
            console.log(err);
            Helper.getErrorResponse(res,'Server Error!');
        }else{
            if(result.length>0){
                BodyParts.getBodyPartsCount(search_key,filter,(err,count)=>{
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

exports.addBodyParts= (req,res,next)=>{
    let inputs=req.body;
    if(inputs.name!='' && inputs.gender!=''){
        let findQuery
        if(inputs.gender==3){
            findQuery=`SELECT body_parts.id from body_parts 
                       LEFT JOIN body_part_translations ON body_parts.id=body_part_translations.body_part_id
                       WHERE body_parts.gender=? AND body_part_translations.name=? OR body_parts.gender=? AND body_part_translations.name=?`;
            params=[1,inputs.name,2,inputs.name]           
        }else{
            findQuery=`SELECT body_parts.id from body_parts 
                       LEFT JOIN body_part_translations ON body_parts.id=body_part_translations.body_part_id
                       WHERE body_parts.gender=? AND body_part_translations.name=?`;
                       params=[inputs.gender,inputs.name]            
        }
        connection.query(findQuery,params,(err,query)=>{
            if(err){
                console.log(err);
                Helper.getErrorResponse(res,'Server Error!');
            }else{
                console.log(query);
                if(query.length>0){ //checking if specific body part is available or not
                    Helper.getErrorResponse(res,'Body Part Already Present!');
                }else{
                    BodyParts.addBodyParts(inputs,(err,result)=>{
                        if(err){
                            console.log(err);
                            Helper.getErrorResponse(res,'Server Error!');
                        }else{
                            Helper.getSuccessResponse(res,'Body Part Added!');
                        }
                    });
                }
            }
        });               
        
    }else{
        Helper.getErrorResponse(res,'Please Enter all required Feilds!');
    }
    
}

exports.editBodyParts=(req,res,next)=>{
    let inputs=req.body;
    let part_id=inputs.id?inputs.id:'';
    let name=inputs.name?inputs.name:'';
    BodyParts.editBodyPart(inputs,(err,result)=>{
        if(err){
            Helper.getErrorResponse(res,'Server Error!');
        }else{
            Helper.getSuccessResponse(res,'Body Part Updated!');
        }
    });
}

exports.deleteBodyParts=(req,res,next)=>{
    let inputs=req.body;
    let part_id=inputs.id?inputs.id:'';
    BodyParts.deleteBodyPart(part_id,(err,result)=>{
        if(err){
            Helper.getErrorResponse(res,'Server Error!');
        }else{
            Helper.getSuccessResponse(res,'Body Part Deleted!');
        }
    });
}