import Joi from 'joi';

module.exports.create = {
  body: {
    gender: Joi.boolean().required(),
    fullName: Joi.object().keys({ first: Joi.string().min(2).max(30).required(), last: Joi.string().min(2).max(30).required() }),
    email: Joi.string().email().min(8).max(30).required(),
    password: Joi.string().regex(/[a-zA-Z0-9]{3,30}/).required()
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
    gender: Joi.boolean(),
    fullName: Joi.object().keys({ first: Joi.string().min(2).max(30), last: Joi.string().min(2).max(30) }),
    email: Joi.string().email().min(8).max(30),
    password: Joi.string().regex(/[a-zA-Z0-9]{3,30}/)
  }
}

module.exports.login = {
  body: {
    email: Joi.string().email().min(8).max(30).required(),
    password: Joi.string().regex(/[a-zA-Z0-9]{3,30}/).required()
  }
}

module.exports.changePassword = {
  body: {
    currentPassword: Joi.string().regex(/[a-zA-Z0-9]{3,30}/).required(),
    newPassword: Joi.string().regex(/[a-zA-Z0-9]{3,30}/).required(),
    confirmedPassword: Joi.string().regex(/[a-zA-Z0-9]{3,30}/).required()
  }
}