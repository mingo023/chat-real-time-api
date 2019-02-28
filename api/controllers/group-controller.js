import { messageRepository, groupRepository } from '../../repositories';
import { ResponseHandler } from '../../helper';

export default class GroupController {
  static async getAll(req, res, next) {
    try {
  
      const options = {
        ...req.body,
        populate: [
          {
            path: 'author',
            select: '-password'
          },
          {
            path: 'members',
            select: '-password'
          }
        ],
        lean: true
      };
  
      const groups = await groupRepository.getAll(options);
      if (!groups.length) { return next(new Error('Groups not found!')) };
  
      return ResponseHandler.returnSuccess(res, groups);
  
    } catch (err) {
      return next(err);
    }
  };

  static async get(req, res, next = (e) => {
    return Promise.reject(e);
  }) {
    try {
  
      const options = {
        where: { _id: req.params.id },
        populate: [
          {
            path: 'author',
            select: '-password'
          },
          {
            path: 'members',
            select: '-password'
          }
        ],
        lean: true
      };
  
      const group = await groupRepository.get(options);
      if (!group) {
        return next(new Error('Group not found!'));
      }
      if (res) {
        return ResponseHandler.returnSuccess(res, group);
      }
      return group;
    } catch (err) {
      return next(err);
    }
  };

  static async create(req, res, next = (e) => {
    return Promise.reject(e);
  }) {
    try {
  
      const { members } = req.body;
      const author = req.user._id;

      members.unshift(author);
      const data = {
        ...req.body,
        author,
        members,
        type: members.length > 2 ? 'public' : 'private'
      };
      
      const options = {
        where: {
          members: { $all: data.members }
        },
        lean: true
      };
      
      if (data.type === 'private') {
        const isGroupPrivateExist = await groupRepository.get(options) !== null;
        if (isGroupPrivateExist) {
          return next(new Error('This private group is exist!'));
        }
      }
  
      const group = groupRepository.create(data);
      await group.save();
      if (res) {
        return ResponseHandler.returnSuccess(res, group);
      }
      return group;
    } catch (err) {
      return next(err);
    };
  };

  static async update(req, res, next) {
    try {
    
      const options = {
        where: { _id: req.params.id },
        data: { $set: req.body },
        lean: true
      };
      const group = await groupRepository.findOneAndUpdate(options);
  
      if (!group) {
        return next(new Error('Group not found'));
      }
  
      return ResponseHandler.returnSuccess(res, { group: { ...group._doc, ...req.body }})
  
    } catch (err) {
      return next(err);
    }
  };

  static async addMembers(req, res, next) {
    try {
      
      const membersAdded = req.body.members;
      const isMembersExisted = await groupRepository.get({
        where: {
          _id: req.params.id,
          members: { $in: membersAdded }
        },
        select: '_id',
        lean: true
      }) !== null;
      
      if (isMembersExisted) {
        return next(new Error('Members added is already existed in this group!'));
      }
      const group = await groupRepository.get({
        where: { _id: req.params.id },
        select: 'author members'
      });
  
      group.members = group.members.concat(membersAdded);
      await group.save();
  
      return ResponseHandler.returnSuccess(res, group);
  
    } catch (err) {
      return next(err);
    }
  };

  static async deleteMembers(req, res, next) {
    try {
      
      const _id = req.params.id;
      const group = await groupRepository.get({
        where: { _id }
      });
      if (!group) {
        return next(new Error('Group not found!'));
      }
      const { member } = req.body;
  
      group.members.splice(group.members.indexOf(member), 1);
  
      await group.save();
  
      return ResponseHandler.returnSuccess(res, group);
  
    } catch (err) {
      return next(err);
    }
  };

  static async delete(req, res, next) {
    try {
      const optionsGroup = {
        where: {
          _id: req.params.id,
          author: req.user._id
        },
        data: { $set: { deletedAt: new Date() } },
        lean: true
      };
      const group = await groupRepository.findOneAndUpdate(optionsGroup);
      if (!group) {
        return next(new Error('Group not found'));
      }
      const optionsMessage = {
        where: { group: group._id },
        data: { $set: { deletedAt: new Date() } },
        lean: true
      };
  
      await messageRepository.findOneAndUpdate(optionsMessage);
      
      return ResponseHandler.returnSuccess(res, { message: 'Deleted group Successly!' });
    } catch (err) {
      return next(err);
    }
  };
  static async getGroupByUser(req, res, next) {
    try {
      
      const options = {
        where: { members: req.user._id },
        populate: 'lastMessage',
        lean: true
      };
      const groups = await groupRepository.getAll(options);
      if (res) {
        return ResponseHandler.returnSuccess(res, groups);
      }
      return groups;
    } catch (err) {
      return next(err);
    }
  };
};
