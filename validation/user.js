import Joi from 'joi';
 
module.exports = {
  body: {
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    phone: Joi.number().required(),
    age: Joi.number().required(),
    email: Joi.string().email().required(),
    password: Joi.string().regex(/[a-zA-Z0-9]{3,30}/).required()
  }
};  