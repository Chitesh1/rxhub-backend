
let express = require('express');
let router=express.Router();
let HomeController=require('../../controllers/admin/HomeController');
let UserController=require('../../controllers/admin/UserController');
let DiseaseController=require('../../controllers/admin/DiseaseController');
let BodyPartController=require('../../controllers/admin/BodyPartController');
let SystemController=require('../../controllers/admin/DrugSystemController');
let GenericController=require('../../controllers/admin/DrugGenericController');
let BrandController=require('../../controllers/admin/DrugBrandController');
let CategoryController=require('../../controllers/admin/CategoryController');
let MedicineController=require('../../controllers/admin/MedicineController');
let DesignationController=require('../../controllers/admin/DesignationController');
let EnquiryController=require('../../controllers/admin/InquiriesController');
let AskedController=require('../../controllers/admin/AskedQuestion');
let NotificationController=require('../../controllers/admin/NotificationController');
let FaqController=require('../../controllers/admin/FaqController');
let CatController=require('../../controllers/admin/DesignationCat');
let SubCatController=require('../../controllers/admin/DesignationSubCat');
let SymptomController=require('../../controllers/admin/SymptomController');
let passport = require('passport');
const multer  = require('multer');

let rand =Date.now();
var uploads='public/uploads';
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
router.post('/login',HomeController.login);
router.post('/upload',upload.single('file'),HomeController.upload);
router.post('/password/change',passport.authenticate('admin', {failureRedirect: '/api/failResponse',session:true}),HomeController.changePassword);

router.get('/dashboard',passport.authenticate('admin', {failureRedirect: '/api/failResponse',session:true}),HomeController.dashboard);

//userModule
router.get('/user',passport.authenticate('admin', {failureRedirect: '/api/failResponse',session:true}),UserController.getUserListing);
router.get('/user/:id',passport.authenticate('admin', {failureRedirect: '/api/failResponse',session:true}),UserController.getUserDetail);
router.put('/user',passport.authenticate('admin', {failureRedirect: '/api/failResponse',session:true}),UserController.updateUserStatus);
router.get('/user-all',passport.authenticate('admin', {failureRedirect: '/api/failResponse',session:true}),UserController.getAllUserListing);
//Disease Module
router.get('/disease',passport.authenticate('admin', {failureRedirect: '/api/failResponse',session:true}),DiseaseController.listDiseases);
router.post('/disease',passport.authenticate('admin', {failureRedirect: '/api/failResponse',session:true}),DiseaseController.createDiseases);
router.put('/disease',passport.authenticate('admin', {failureRedirect: '/api/failResponse',session:true}),DiseaseController.updateDisease);
router.delete('/disease',passport.authenticate('admin', {failureRedirect: '/api/failResponse',session:true}),DiseaseController.deleteDisease);

//bodyParts Module
router.get('/body-parts',passport.authenticate('admin', {failureRedirect: '/api/failResponse',session:true}),BodyPartController.listBodyParts);
router.post('/body-parts',passport.authenticate('admin', {failureRedirect: '/api/failResponse',session:true}),BodyPartController.addBodyParts);
router.put('/body-parts',passport.authenticate('admin', {failureRedirect: '/api/failResponse',session:true}),BodyPartController.editBodyParts);
router.delete('/body-parts',passport.authenticate('admin', {failureRedirect: '/api/failResponse',session:true}),BodyPartController.deleteBodyParts);

//System Module
router.get('/system',passport.authenticate('admin', {failureRedirect: '/api/failResponse',session:true}),SystemController.listDrugSystem);
router.post('/system',passport.authenticate('admin', {failureRedirect: '/api/failResponse',session:true}),SystemController.createDrugSystem);
router.put('/system',passport.authenticate('admin', {failureRedirect: '/api/failResponse',session:true}),SystemController.updateDrugSystem);
router.delete('/system',passport.authenticate('admin', {failureRedirect: '/api/failResponse',session:true}),SystemController.deleteDrugSystem);

//Generic Module
router.get('/generic',passport.authenticate('admin', {failureRedirect: '/api/failResponse',session:true}),GenericController.listGeneric);
router.post('/generic',passport.authenticate('admin', {failureRedirect: '/api/failResponse',session:true}),GenericController.createGeneric);
router.put('/generic',passport.authenticate('admin', {failureRedirect: '/api/failResponse',session:true}),GenericController.updateGeneric);
router.delete('/generic',passport.authenticate('admin', {failureRedirect: '/api/failResponse',session:true}),GenericController.deleteGeneric);

//Brand Module
router.get('/brand',passport.authenticate('admin', {failureRedirect: '/api/failResponse',session:true}),BrandController.listBrands);
router.post('/brand',passport.authenticate('admin', {failureRedirect: '/api/failResponse',session:true}),BrandController.createBrand);
router.put('/brand',passport.authenticate('admin', {failureRedirect: '/api/failResponse',session:true}),BrandController.updateBrand);
router.delete('/brand',passport.authenticate('admin', {failureRedirect: '/api/failResponse',session:true}),BrandController.deleteBrand);

//category Module
router.get('/category',passport.authenticate('admin', {failureRedirect: '/api/failResponse',session:true}),CategoryController.listCategories);
router.post('/category',passport.authenticate('admin', {failureRedirect: '/api/failResponse',session:true}),CategoryController.createCategory);
router.put('/category',passport.authenticate('admin', {failureRedirect: '/api/failResponse',session:true}),CategoryController.updateCategory);
router.delete('/category',passport.authenticate('admin', {failureRedirect: '/api/failResponse',session:true}),CategoryController.deleteCategory);
router.get('/classification',passport.authenticate('admin', {failureRedirect: '/api/failResponse',session:true}),CategoryController.listClassification);
//Medicine Module
router.get('/medicine',passport.authenticate('admin', {failureRedirect: '/api/failResponse',session:true}),MedicineController.listMedicines);
router.post('/medicine',passport.authenticate('admin', {failureRedirect: '/api/failResponse',session:true}),MedicineController.createMedicine);
router.post('/import/medicines',passport.authenticate('admin', {failureRedirect: '/api/failResponse',session:true}),MedicineController.postCSV);
router.put('/medicine',passport.authenticate('admin', {failureRedirect: '/api/failResponse',session:true}),MedicineController.updateMedicine);
router.get('/medicine/:medicine_id',passport.authenticate('admin', {failureRedirect: '/api/failResponse',session:true}),MedicineController.medicineDetail);
router.get('/notes/:id',passport.authenticate('admin', {failureRedirect: '/api/failResponse',session:true}),MedicineController.getAllDesignation);
router.get('/designations/:id',passport.authenticate('admin', {failureRedirect: '/api/failResponse',session:true}),MedicineController.selectedDesignations);
router.delete('/medicine',passport.authenticate('admin', {failureRedirect: '/api/failResponse',session:true}),MedicineController.deleteMedicine);
router.put('/special-instruction',passport.authenticate('admin', {failureRedirect: '/api/failResponse',session:true}),MedicineController.updateSpecialInstruction);
router.get('/symptoms/body',passport.authenticate('admin', {failureRedirect: '/api/failResponse',session:true}),MedicineController.getSymptoms);
router.get('/cats-list',passport.authenticate('admin', {failureRedirect: '/api/failResponse',session:true}),MedicineController.getList)

//Designation Module
router.get('/designation',passport.authenticate('admin', {failureRedirect: '/api/failResponse',session:true}),DesignationController.listDesignation);
router.post('/designation',passport.authenticate('admin', {failureRedirect: '/api/failResponse',session:true}),DesignationController.createDesignation);
router.put('/designation',passport.authenticate('admin', {failureRedirect: '/api/failResponse',session:true}),DesignationController.updateDesignation);
router.delete('/designation',passport.authenticate('admin', {failureRedirect: '/api/failResponse',session:true}),DesignationController.deleteDesignation);

//Enquiry Module
router.get('/enquiry',passport.authenticate('admin', {failureRedirect: '/api/failResponse',session:true}),EnquiryController.listEnquiry);
router.post('/enquiry',passport.authenticate('admin', {failureRedirect: '/api/failResponse',session:true}),EnquiryController.replyEnquiry);
router.delete('/enquiry',passport.authenticate('admin', {failureRedirect: '/api/failResponse',session:true}),EnquiryController.deleteEnquiry);

//Question Module
router.get('/question',passport.authenticate('admin', {failureRedirect: '/api/failResponse',session:true}),AskedController.listQuestions);
router.delete('/question',passport.authenticate('admin', {failureRedirect: '/api/failResponse',session:true}),AskedController.deleteQuestion);
router.get('/question/:id',passport.authenticate('admin', {failureRedirect: '/api/failResponse',session:true}),AskedController.questionDetail);

//notification Module
router.post('/notification',passport.authenticate('admin', {failureRedirect: '/api/failResponse',session:true}),NotificationController.postNotification);

//faq Module
router.get('/faq',passport.authenticate('admin', {failureRedirect: '/api/failResponse',session:true}),FaqController.listFaq);
router.post('/faq',passport.authenticate('admin', {failureRedirect: '/api/failResponse',session:true}),FaqController.postFaq);
router.put('/faq',passport.authenticate('admin', {failureRedirect: '/api/failResponse',session:true}),FaqController.updateFaq);
router.delete('/faq',passport.authenticate('admin', {failureRedirect: '/api/failResponse',session:true}),FaqController.deleteFaq);

//Category Module
router.get('/designation-cat',passport.authenticate('admin', {failureRedirect: '/api/failResponse',session:true}),CatController.listCategories);
router.post('/designation-cat',passport.authenticate('admin', {failureRedirect: '/api/failResponse',session:true}),CatController.createCategory);
router.put('/designation-cat',passport.authenticate('admin', {failureRedirect: '/api/failResponse',session:true}),CatController.updateCategory);
router.delete('/designation-cat',passport.authenticate('admin', {failureRedirect: '/api/failResponse',session:true}),CatController.deleteCategory);

//subCategory Module
router.get('/designation-subcat',passport.authenticate('admin', {failureRedirect: '/api/failResponse',session:true}),SubCatController.listSubCategories);
router.post('/designation-subcat',passport.authenticate('admin', {failureRedirect: '/api/failResponse',session:true}),SubCatController.createSubCategory);
router.put('/designation-subcat',passport.authenticate('admin', {failureRedirect: '/api/failResponse',session:true}),SubCatController.updateSubCategory);
router.delete('/designation-subcat',passport.authenticate('admin', {failureRedirect: '/api/failResponse',session:true}),SubCatController.deleteSubCategory);

//Symptom Module
router.get('/symptoms',passport.authenticate('admin', {failureRedirect: '/api/failResponse',session:true}),SymptomController.listSymptoms);
router.post('/symptoms',passport.authenticate('admin', {failureRedirect: '/api/failResponse',session:true}),SymptomController.createSymptoms);
router.put('/symptoms',passport.authenticate('admin', {failureRedirect: '/api/failResponse',session:true}),SymptomController.updateSymptoms);
router.delete('/symptoms',passport.authenticate('admin', {failureRedirect: '/api/failResponse',session:true}),SymptomController.deleteSymptoms);
module.exports=router;