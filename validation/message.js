import Joi from 'joi';

export default class MessageValidation {
  create() {
    return {
      body: {
        messeages: Joi.string().min(1).max(255),
        group: Joi.string().regex(/^[0-9a-fA-F]{24}$/, 'Id must to be the ObjectId'),
        author: Joi.string().regex(/^[0-9a-fA-F]{24}$/, 'Id must to be the ObjectId')
      }
    }
  };

  get() {
    return {
      params: {
        id: Joi.string().regex(/^[0-9a-fA-F]{24}$/, 'Id must to be the ObjectId').required()
      }
    }
  };

  update() {
    return {
      params: {
        id: Joi.string().regex(/^[0-9a-fA-F]{24}$/, 'Id must to be the ObjectId')
      },
      body: {
        messeages: Joi.string().min(1).max(255),
      }
    }
  };

  delete() {
    return {
      params: {
        id: Joi.string().regex(/^[0-9a-fA-F]{24}$/, 'Id must to be the ObjectId')
      }
    }
  };
}