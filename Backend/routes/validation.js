//validation 
const Joi = require('joi');

//registerValidation
const registerValidation = (data) => {
    const schema = Joi.object({
        username: Joi.string().min(3).required(),
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required()
    });
    const validationOptions = { abortEarly: false };
    return schema.validate(data, validationOptions);
}
//loginValidation
const loginValidation = (data) => {
    const schema = Joi.object({
        email: Joi.string().email().required(),
        password: Joi.string().min(6).required()
    });
    const validationOptions = { abortEarly: false };
    return schema.validate(data, validationOptions);
}

module.exports.registerValidation = registerValidation;
module.exports.loginValidation = loginValidation;