import Joi from 'joi';
 
module.exports.createUser = {
  body: {
    firstName: Joi.string().required(),
    lastName: Joi.string().required(),
    phone: Joi.number().required(),
    age: Joi.number().required(),
    email: Joi.string().email().required(),
    password: Joi.string().regex(/[a-zA-Z0-9]{3,30}/).required()
  }
};  

module.exports.getUser = {
  params: {
    id: Joi.string().regex(/^[0-9a-fA-F]{24}$/, 'Id must to be the ObjectId')
  }
}