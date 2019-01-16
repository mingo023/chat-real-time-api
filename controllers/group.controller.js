import Group from '../models/group';
import { set, Model } from 'mongoose';
import { groupRepository } from '../repositories';
import { ResponseHandler } from '../helper';


const GroupController = {};

GroupController.getAll = async (req, res, next) => {
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

    return ResponseHandler.returnSuccess(res, { groups });

  } catch (err) {
    return next(err);
  }
};

GroupController.get = async (req, res, next) => {
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

    return ResponseHandler.returnSuccess(res, { group });

  } catch (err) {
    return next(err);
  };
};

GroupController.create = async (req, res, next) => {
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
        author: data.author,
        members: { $all: data.members }
      },
      lean: true
    };
    // members.unshift(author);
    if (data.type === 'private') {
      if (data.members.length > 2) {
        return next(new Error('Members is too long!'));
      }
      const isGroupPrivateExist = await groupRepository.get(options) !== null;
      if (isGroupPrivateExist) {
        return next(new Error('This private group is exist!'));
      }
    }

    const group = groupRepository.create(data);
    await group.save();

    return ResponseHandler.returnSuccess(res, { group });

  } catch (err) {
    return next(err);
  };
};

GroupController.update = async (req, res, next) => {
  try {
  
    const options = {
      where: { _id: req.params.id },
      data: { $set: req.body }
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

GroupController.addMembers = async (req, res, next) => {
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

    return ResponseHandler.returnSuccess(res, { group });

  } catch (err) {
    return next(err);
  }
};

GroupController.deleteMembers = async (req, res, next) => {
  try {
    // const id = req.params.id;
    // const group = await Group.findById(id);
    // if (!group) {
    //   return res.status(400).json({
    //     isSuccess: false,
    //     message: 'Group not found'
    //   });
    // }
    // const { mems } = req.body;
    // if (!mems) {
    //   res.status(400).json({ message: 'mems is required' })
    // }

    // group.members.splice(group.members.indexOf(mems), 1);
    // await group.save();
    // return res.status(200).json({
    //   isSuccess: true,
    //   message: 'Deleted member'
    // });
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
    return ResponseHandler.returnSuccess(res, { group });

  } catch (err) {
    return next(err);
  }
};

GroupController.delete = async (req, res, next) => {
  try {
    const options = {
      where: { _id: req.params.id },
      data: { $set: { deletedAt: new Date() } }
    }
    let group = await groupRepository.findOneAndUpdate(options);

    if (!group) {
      return next(new Error('Group not found'));
    }

    return res.status(200).json({ message: 'Deleted Successly!' });
  } catch (err) {
    return next(err);
  }
};

export default GroupController;