import Joi from 'joi';

module.exports.create = {
  body: {
    messeages: Joi.string().min(1).max(255),
    group: Joi.string().regex(/^[0-9a-fA-F]{24}$/, 'Id must to be the ObjectId'),
    author: Joi.string().regex(/^[0-9a-fA-F]{24}$/, 'Id must to be the ObjectId')
  }
};

module.exports.get = {
  params: {
    id: Joi.string().regex(/^[0-9a-fA-F]{24}$/, 'Id must to be the ObjectId').required()
  }
}

module.exports.update = {
  params: {
    id: Joi.string().regex(/^[0-9a-fA-F]{24}$/, 'Id must to be the ObjectId')
  },
  body: {
    messeages: Joi.string().min(1).max(255),
  }
}

module.exports.delete = {
  params: {
    id: Joi.string().regex(/^[0-9a-fA-F]{24}$/, 'Id must to be the ObjectId')
  }
}