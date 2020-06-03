let Enquiry = require('../../model/enquiries');
let Helper = require('../helper/helper');
const path= require('path');
require('dotenv').config();
var app = require('express')(),
    mailer = require('express-mailer');
    mailer.extend(app, {
        from: 'no-reply@example.com',
        host: 'smtp.gmail.com', // hostname
        secureConnection: true, // use SSL
        port: 465, // port for secure SMTP
        transportMethod: 'SMTP', // default is SMTP. Accepts anything that nodemailer accepts
        auth: {
          user: process.env.Mail_ID,
          pass: process.env.Mail_PASS
        }
      });
      app.set('views',path.join(__dirname,'./../../views/'));
app.set('view engine','jade');
    
exports.listEnquiry = (req,res,next)=>{
    let inputs=req.query;
    let page_count=inputs.page_count?inputs.page_count:0;
    let search_key=inputs.search_key?inputs.search_key:'';
    Enquiry.getEnquiryList(page_count,search_key,(err,result)=>{
        if(err){
            console.log(err);
            Helper.getErrorResponse(res,'Server Error!');
        }else{
            if(result.length>0){
                Enquiry.getEnquiryListCount(search_key,(err,count)=>{
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

exports.deleteEnquiry = (req,res,next)=>{
    let inputs=req.body;
    Enquiry.deleteEnquiry(inputs.id,(err,result)=>{
        if(err){
            Helper.getErrorResponse(res,'Server Error!');
        }else{
            Helper.getSuccessResponse(res,'Enquiry Deleted');
        }
    });
};

exports.replyEnquiry = (req,res,next)=>{
    let inputs=req.body;
    Enquiry.replyEnquiry(inputs,(err,result)=>{
        if(err){
            console.log(err);
            Helper.getErrorResponse(res,'Server Error!');
        }else{
            app.mailer.send('reply', {
               to:inputs.email, // REQUIRED. This can be a comma delimited string just like a normal email to field. 
               subject: inputs.subject, // REQUIRED.
               message:inputs.body,
               }, function (err) {
              if (err) {
                  // handle error
                 console.log(err);
                   Helper.getErrorResponse(res,'Mail Error!','mail',err);
               }else{
                  
                }
             });
            Helper.getSuccessResponse(res,'Reply Posted');
        }
    });
};