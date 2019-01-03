import Joi from 'joi';
Joi.objectId = require('joi-objectid')(Joi);
import { model } from 'mongoose';
 
module.exports.createGroup = {
  body: {
    name: Joi.string().required(),
    author: Joi.objectId(),
    members: Joi.array()
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
