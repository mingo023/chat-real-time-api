import Joi from 'joi';
import { model } from 'mongoose';


module.exports.getAll = {
  query: {
    limit: Joi.number().integer().min(1).max(50).default(2),
    page: Joi.number().integer().min(1).max(50).default(1)
  }
}

module.exports.getGroup = {
  params: {
    id: Joi.string().regex(/^[0-9a-fA-F]{24}$/, 'Id must to be the ObjectId').required()
  }
}

module.exports.createGroup = {
  body: {
    name: Joi.string().required().min(6).max(20),
    author: Joi.string().regex(/^[0-9a-fA-F]{24}$/, 'Id of user must to be objectId'),
    members: Joi.array().items(Joi.string().regex(/^[0-9a-fA-F]{24}$/))
  }
};

module.exports.addMembers = {
  body: {
    members: Joi.array().items(Joi.string().regex(/^[0-9a-fA-F]{24}$/, 'Id of user must to be objectId'))
  },
  params: {
    id: Joi.string().regex(/^[0-9a-fA-F]{24}$/, 'Id must to be the ObjectId')
  }
}

module.exports.updateGroup = {
  body: {
    name: Joi.string().min(6).max(20),
    author: Joi.string().regex(/^[0-9a-fA-F]{24}$/, 'Id of user is invalid'),
    members: Joi.array().items(Joi.string().regex(/^[0-9a-fA-F]{24}$/))
  },
  params: {
    id: Joi.string().regex(/^[0-9a-fA-F]{24}$/, 'Id must to be the ObjectId')
  }
};

module.exports.deleteGroup = {
  params: {
    id: Joi.required()
  }
}
