let Notification=require('../../model/notification');
let connection = require('../../model/connection');
let Helper=require('../helper/helper');
exports.postNotification=async function(req,res,next){
    let inputs=req.body;
    let type=inputs.type?inputs.type:'';
    Notification.postNotification(inputs,type,(err,result)=>{
        if(err){
            console.log(err);
            Helper.getErrorResponse(res,'Server Error!');
        }else{
            if(result.length>0){
                console.log(result);
                result.forEach(element => {
                    connection.query(`INSERT notifications SET to_id=?,subject=?,message=?,type=?`,[element.user_id,inputs.subject,inputs.message,'admin_notification'],(err,reesult)=>{});
                    console.log(element);
                   
                    connection.query(`SELECT is_notification_enable FROM users WHERE id=?`,[element.user_id],(err,result)=>{
                        if(err){
                            console.log(err);
                            Helper.getErrorResponse(res,'Server Error!');
                        }else{
                            console.log(result);
                            if(result[0].is_notification_enable==0){ //sneding notification to enabled notification users
                                Helper.sendNotification(element.device_type,element.device_token,element.fcm_id,inputs);
                            }
                        }
                    });
                });
                Helper.getSuccessResponse(res,'Notification Sent!');
            }else{
                // Helper.getErrorResponse(res,'No Data found!');
                Helper.getSuccessResponse(res,'Notification Sent');
            }
            // Helper.getSuccessResponse(res,'Notification Sent');
        }
    });
}