/* schemas.js */

// load Joi module
const Joi = require('joi');

const signupSchema = Joi.object({
    image:Joi.string().allow(''),
    name: Joi.string().allow(''),
    email: Joi.string().allow(''),
    password:Joi.string().allow(''),
    fb_id: Joi.string().allow(''),
    google_id:Joi.string().allow(''),
    apple_id:Joi.string().allow(''),
    fcm_id:Joi.string().allow(""),
    device_type:Joi.string().allow(''),
    device_token:Joi.string().allow(''),
});

const updateUser=Joi.object({
    mobile_number:Joi.string().required(),
    age:Joi.number().required(),
    gender:Joi.number().required(),
    designation_id:Joi.number().required(),
    company_name:Joi.string().required(),
    // language:Joi.string().required(),
    fcm_id:Joi.string().allow(''),
    device_type:Joi.string().allow(''),
    device_token:Joi.string().allow(''),
    country_code:Joi.string().required(),
    is_notification_enable:Joi.number().allow("")
});
const loginSchema = Joi.object({
    email: Joi.string().required(),
    password:Joi.string().required(),
    fcm_id:Joi.string().allow(''),
    device_type:Joi.number().allow(''),
    device_token:Joi.string().allow('')
});

const resetPass=Joi.object({
    token:Joi.string().required(),
    password:Joi.string().required(),
    email:Joi.string().required(),
});
const forgotPassSchema=Joi.object({
    email:Joi.string().required()
});
const designationSchema=Joi.object({
    language_id:Joi.number().required()
});

const listMedicines=Joi.object({
    type:Joi.number().required(),
    language_id:Joi.number().required()
});

const categoriesInfo=Joi.object({
    id:Joi.number().required(),
    language_id:Joi.number().required(),
    type:Joi.number().required(),
});

const medicinesDetail = Joi.object({
    medicine_id:Joi.number().required(),
    language_id:Joi.number().required(),
    designation_id:Joi.number().required()
});

const searchMedicine=Joi.object({
    search_key:Joi.string().required(),
});



// export the schemas
module.exports = {
    '/signup': signupSchema,
    '/login':loginSchema,
    '/user':updateUser,
    '/password/forgot':forgotPassSchema,
    '/password/reset':resetPass,
    '/designations':designationSchema,
    '/list/medicines':listMedicines,
    '/categories/info':categoriesInfo,
    '/medicine/detail':medicinesDetail,
    '/search':searchMedicine,
}