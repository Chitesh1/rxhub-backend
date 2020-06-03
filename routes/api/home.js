let express = require('express');
let router=express.Router();
let HomeController = require('../../controllers/api/HomeController');
let MedicineController=require('../../controllers/api/MedicineController');
let SchemaValidator = require('../../middleware/SchemaValidator');
let Helper=require('../../controllers/helper/helper');
const validateRequest = SchemaValidator(true);
let passport = require('passport');

var uploads='public/uploads';


const multer  = require('multer');
let rand =Date.now();
const storage=multer.diskStorage({
    destination:function(req,file,callback){
        callback(null,uploads)
    },
    filename:function(req,file,callback){
        callback(null,Date.now()+file.originalname)
    }
});
const upload = multer({
    storage:storage,
    limits:{
        fileSize:4024*4024*1000
    },
    // fileFilter:fileFilter
});
require('dotenv').config();
var aws = require('aws-sdk');
var multerS3 = require('multer-s3');
var app = express();
const spacesEndpoint = new aws.Endpoint('https://rxhubspace.sgp1.digitaloceanspaces.com');
const s3 = new aws.S3({
  endpoint: spacesEndpoint,
  accessKeyId: process.env.ACCESS_KEY_ID,
  secretAccessKey: process.env.SECRET_ACCESS_KEY
});
// Change bucket property to your Space name
var doupload = multer({
    storage: multerS3({
      s3: s3,
      bucket: 'https://rxhubspace.sgp1.digitaloceanspaces.com/Medium',
      acl: 'public-read',
      metadata: function (req, file, cb) {
          console.log(file.fieldname);
        cb(null, {fieldName: file.fieldname});
      },
      key: function (req, file, cb) {
          console.log(Date.now()+file.originalname);
        cb(null, Date.now()+file.originalname)
      }
    })
  });
function isActive(req,res,next){
    console.log(req.user.is_active);
    if(req.user.is_active!=0){
        res.status(401).json({'error':"unauthorized","error_description":"Your Account has been blocked!"});
    }else{
        return next();
    }
    
}
//Before Login
//Authentication Routes
router.post('/signup',validateRequest,HomeController.signup);
router.post('/upload',upload.single('file'),validateRequest,HomeController.uploadFile);
// router.put('/user',passport.authenticate('jwt', {failureRedirect: '/api/failResponse',session:true}),validateRequest,HomeController.addBasicinfo);
router.post('/login',validateRequest,HomeController.login);
router.post('/password/forgot',validateRequest,HomeController.forgotPassword);
router.post('/password/reset',validateRequest,HomeController.resetPassword);
//After Login
router.get('/home',passport.authenticate('jwt', {failureRedirect: '/api/failResponse',session:true}),isActive,(req,res)=>{
    res.json(req.user);
});
router.get('/profile',passport.authenticate('jwt', {failureRedirect: '/api/failResponse',session:true}),isActive,HomeController.profile);
router.put("/profile",validateRequest,passport.authenticate('jwt', {failureRedirect: '/api/failResponse',isActive,session:true}),HomeController.editProfile);
router.get('/designations',validateRequest,HomeController.listDesignations);
router.post('/password/change',validateRequest,passport.authenticate('jwt', {failureRedirect: '/api/failResponse',session:true}),isActive,HomeController.changePassword);
router.get('/logout',passport.authenticate('jwt', {failureRedirect: '/api/failResponse',session:true}),isActive,HomeController.logout);

//Medicine Module
router.get('/systems',passport.authenticate('jwt', {failureRedirect: '/api/failResponse',session:true}),isActive,MedicineController.system);
router.get('/brands',passport.authenticate('jwt', {failureRedirect: '/api/failResponse',session:true}),isActive,MedicineController.brand);
router.get('/diseases',passport.authenticate('jwt', {failureRedirect: '/api/failResponse',session:true}),isActive,MedicineController.disease);
router.get('/body-parts',passport.authenticate('jwt', {failureRedirect: '/api/failResponse',session:true}),isActive,MedicineController.bodyParts);
router.get('/medicines',passport.authenticate('jwt', {failureRedirect: '/api/failResponse',session:true}),isActive,MedicineController.filteredResults);
router.get('/searched-medicines',passport.authenticate('jwt', {failureRedirect: '/api/failResponse',session:true}),isActive,MedicineController.getRecentlySearchedMedicines);
router.get('/generic-names',passport.authenticate('jwt', {failureRedirect: '/api/failResponse',session:true}),isActive,MedicineController.genericNames);
router.get("/body-part/symptoms",passport.authenticate('jwt', {failureRedirect: '/api/failResponse',session:true}),isActive,MedicineController.symptoms);
router.get("/medicine/:medicine_id",validateRequest,passport.authenticate('jwt', {failureRedirect: '/api/failResponse',session:true}),isActive,MedicineController.detailMedicines);

router.get('/faqs',passport.authenticate('jwt', {failureRedirect: '/api/failResponse',session:true}),isActive,HomeController.faq);
router.post('/faq',HomeController.postFaq);
router.get('/questions',HomeController.listQuestions);
router.post('/inquiry',passport.authenticate('jwt', {failureRedirect: '/api/failResponse',session:true}),isActive,HomeController.enquiry);


router.get('/upload-do',(req,res)=>{
    console.log(req.files);
    const BUCKET_NAME = process.env.BUCKET_NAME;
        aws.config.update({
            accessKeyId: process.env.ACCESS_KEY_ID,
            secretAccessKey: process.env.SECRET_ACCESS_KEY,
            region: process.env.REGION
        });
        var s3 = new aws.S3({
            endpoint: process.env.ENDPOINT
        });
        let name = file.originalname.split(' ').join('-');
        let filename = Date.now()+ '-' + name;
        console.log(file)
        var params = {
            Body: file.buffer,
            Bucket: BUCKET_NAME,
            Key: 'Uploads/Images/' + filename,
            ACL: 'public-read',
          };
        console.log(params);
        //   const s3 = new AWS.S3();
        //upload origional image
        sharp(file.buffer).rotate().toBuffer(function (err, data) {
            console.log(1)
          if (err) {
              throw err
          };
          s3.putObject({
              Body: data,
              Bucket: BUCKET_NAME,
              Key: 'Uploads/Images/' + filename,
              ACL: 'public-read'
          }, function (err, data) {
              if (err) {
                  console.log('Failed to resize image due to an error: ' + err);
                  return {
                      message: 'Failed to resize image due to an error: ' + err
                  };
              } 
          });
      });
      //upload small image
      sharp(file.buffer).resize(50).rotate().toBuffer(function (err, data) {
          if (err) {
              throw err
          };
          s3.putObject({
              Body: data,
              Bucket: BUCKET_NAME,
              Key: 'Uploads/Images/Small/' + filename,
              ACL: 'public-read'
          }, function (err, data) {
              if (err) {
                  // console.log('Failed to resize image due to an error: ' + err);
                  return {
                      message: 'Failed to resize image due to an error: ' + err
                  };
              } 
          });
      });
      //upload medium image
      sharp(file.buffer).resize(250).rotate().toBuffer(function (err, data) {
          if (err) {
              throw err
          };
          s3.putObject({
              Body: data,
              Bucket: BUCKET_NAME,
              Key: 'Uploads/Images/Medium/' + filename,
              ACL: 'public-read'
          }, function (err, data) {
              if (err) {
                  // console.log('Failed to resize image due to an error: ' + err);
                  return {
                      message: 'Failed to resize image due to an error: ' + err
                  };
              } 
          });
      });
      return res.status(200).json({message:'File Uploaded.', filename:filename});
});

router.get('/file',(req,res)=>{
  let query=req.query;
  
  const BUCKET_NAME = process.env.BUCKET_NAME;
  aws.config.update({
        accessKeyId: process.env.ACCESS_KEY_ID,
        secretAccessKey: process.env.SECRET_ACCESS_KEY,
        region: process.env.REGION
    });
    var s3 = new aws.S3({
        endpoint: 'https://rxhubspace.sgp1.digitaloceanspaces.com/https%3A//rxhubspace.sgp1.digitaloceanspaces.com/Medium/'
    });
    var folder = 'Uploads/Images/';
    if(!req.query.filename) {
        return res.status(400).json({
            error: 'bad_request',
         message: 'Image is required.'
        });
    }
    if(req.query.folder) {
        var folder = 'Uploads/Images/' + req.query.folder + '/';
    }
    const params = {
        Bucket: process.env.BUCKET_NAME,
       // Key: folder + filename.filename
        Key: req.query.filename
    };
    console.log("key:"+params.Key)
    console.log(folder);
    s3.getObject(params, function(err, data) {
         if(err){
             console.log(err);
            return res.status(400).json({
                error:"Bad Request",
                   error_description:err
                 });
         }
        if(data) {
          console.log(data.Body);
            res.writeHead(200, {'Content-Type': 'image/jpeg'});
            res.write(data.Body, 'binary');
            res.end(null, 'binary');
        }
     });
});
router.all('/failResponse',(req,res)=>{
    res.status(401).json({'error':"unauthorized","error_description":"Login Required"});
});
module.exports=router;