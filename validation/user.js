import Joi from 'joi';

module.exports.create = {
  body: {
    gender: Joi.boolean(),
    fullName: Joi.object().keys({ first: Joi.string().required(), last: Joi.string().required() }),
    email: Joi.string().email().required(),
    password: Joi.string().regex(/[a-zA-Z0-9]{3,30}/).required()
  }
};

module.exports.get = {
  params: {
    id: Joi.string().regex(/^[0-9a-fA-F]{24}$/, 'Id must to be the ObjectId')
  }
}

module.exports.login = {
  body: {
    email: Joi.string().email().required(),
    password: Joi.string().regex(/[a-zA-Z0-9]{3,30}/).required()
  }
}

module.exports.changePassword = {
  params: {
    id: Joi.string().regex(/^[0-9a-fA-F]{24}$/, 'Id must to be the ObjectId')
  },
  body: {
    oldPassword: Joi.string().regex(/[a-zA-Z0-9]{3,30}/).required(),
    newPassword: Joi.string().regex(/[a-zA-Z0-9]{3,30}/).required(),
    confirmedPassword: Joi.string().regex(/[a-zA-Z0-9]{3,30}/).required()
  }
}