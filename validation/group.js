import Joi from 'joi';
 
module.exports = {
  body: {
    name: Joi.string().required(),
    author: Joi.string().required(),
    members: Joi.array().items(Joi.number().valid([1, 2, 3, 4, 5]))
  }
};  