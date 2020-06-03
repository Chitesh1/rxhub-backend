let logs = require('../../config/log');
var FCM = require('fcm-node');
var serverKey=require('../../config/privatekey.json');  //put the generated private key path here
var fcm = new FCM(serverKey);
require('dotenv').config();
//aws-sdk
// Configure client for use with Spaces
const AWS= require('aws-sdk');
const spacesEndpoint = new AWS.Endpoint('https://rxhubspace.sgp1.digitaloceanspaces.com/');
const s3 = new AWS.S3({
    endpoint: spacesEndpoint,
    accessKeyId: process.env.ACCESS_KEY_ID,
    secretAccessKey: process.env.SECRET_ACCESS_KEY
});
class Helper{

    static getErrorResponse(res,message,type=null,err=null){
        if(err && type){
            console.log(err);
            logs.create(type,err);
        }
        res.status(400).json({'error':'bad_request','error_description':message});
    }

    static getCreateResponse(res,message,result=null){
        res.status(200).json(result);
    }

    static getSuccessResponse(res,message=null,result=null){
        console.log(result);
        if(message){
            res.status(200).json({'message':message});
        }else if(result){
            res.status(200).json(result);
        }else if(message && result){
            res.status(200).json({'message':message,'result':result});
        }else{
            return 
        }
        
    }

    static getListingResponse(res,count,result){
        res.status(200).json({'count':count,'result':result});
    }

    static getTokenResponse(res,token,user){
        res.status(200).json({'token':token,'user':user})
    }

    static sendNotification(device_type,device_token,fcm_id=null,inputs){
        let subject=inputs.subject?inputs.subject:'';
        let msg=inputs.message?inputs.message:'';
        let token='';
        if(device_type==0){
            token=fcm_id;
        }else{
            token=device_token;
        }
        console.log(token);
        var message = { //this may vary according to the message type (single recipient, multicast, topic, et cetera)
            // to: 'fNUbacBsCc4:APA91bHBPKWPsCasjvHWgBaFBUqLTPW3r6uIL7hP_7ch08-7SMrpcGjfKzXdSxBIieDvQbaFKy22905IXHBBw356Vi8tvoNdwg_h4_qVDvvXORW8ITZWvBM3WdndBVBOnMjnd3IznbrK',
            // to: 'dpIBMorCFxA:APA91bEWDvljYoJOW9hgudqfvaqfRkfqRn3qdEFpWD3KQG_w-M6dHMRA11ws_Xxs4ijsLIHKW7tfnZi8FcRLj-3jILour_aFZ5OPgzjpIXFUwywyLx8ZIQL3NPbnLeGIWMalFzSsqYwY',
            to:token,
            notification: {
                title:subject,
                body: msg
            },
            data: {  //you can send only notification or only data(or include both)
                subject: subject,
                message: msg,
                type:'admin_notification'
            }
        };
        fcm.send(message, function(err, response){
            if (err) {
                console.log(err);
                // console.log("Something has gone wrong!")
            } else {
                console.log(response);
                // console.log("Successfully sent with response: ", response)
            }
        });
    }

    static uploadFile(filepath){
        console.log(filepath);
        var params = {
            Body: "The contents of the file",
            Bucket: "https://rxhubspace.sgp1.digitaloceanspaces.com/",
            Key: 'test.txt',
        };
        
        s3.putObject(params, function(err, data) {
            if (err) console.log(err, err.stack);
            else     console.log(data);
        });
    }
}

module.exports=Helper;