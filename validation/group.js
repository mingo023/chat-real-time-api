import Joi from 'joi';
import { model } from 'mongoose';
 
module.exports.createGroup = {
  body: {
    name: Joi.string().required(),
    author: Joi.string().required()
  }
};

module.exports.updateGroup = {
  body: {
    name: Joi.string().required()
  },
  params: {
    id: Joi.required()
  }
};

module.exports.deleteGroup = {
  params: {
    id: Joi.required()
  }
}