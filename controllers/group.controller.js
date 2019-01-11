import Group from '../models/group';
import User from '../models/user';
import { set, Model } from 'mongoose';

const GroupController = {};

GroupController.getAll = async (req, res, next) => {
  try {
    const { page, limit } = req.query;
    const skip = (parseInt(page) - 1) * parseInt(limit);
    const groups = await Group
      .find()
      .sort('-dateAdded')
      .populate([
        {
          path: 'author',
          select: '-password'
        },
        {
          path: 'members',
          select: '-password'
        }
      ])
      .skip(skip)
      .limit(parseInt(limit))
      .sort({ _id: 1 })
      .lean(true);
    if (!groups.length) { return next(new Error('Groups not found!')) };
    return res.status(200).json({
      isSuccess: true,
      groups
    });
  } catch (err) {
    return next(err);
  }
};

GroupController.get = async (req, res, next) => {
  try {
    const id = req.params.id;
    const group = await Group
      .findOne({ _id: id })
      .populate([
        {
          path: 'author',
          select: '-password'
        },
        {
          path: 'members',
          select: '-password'
        }
      ])
      .lean(true);
    if (!group) {
      return next(new Error('Group not found!'));
    }
    return res.status(200).json({
      isSuccess: true,
      group
    });
  } catch (err) {
    return next(err);
  };
};

GroupController.create = async (req, res, next) => {
  try {
    const { name, author, members } = req.body;
    const group = new Group({ name, author, members });
    // save user to db
    await group.save();
    return res.status(200).json({
      isSuccess: true,
      group
    });
  } catch (err) {
    return next(err);
  };
};

GroupController.update = async (req, res, next) => {
  try {
    const id = req.params.id;
    const infoUpdate = req.body;
    let group = await Group.findOne({ _id: id });

    if (!group) {
      return next(new Error('Group not found'));
    }

    Object.assign(group, infoUpdate);

    await group.save();

    return res.status(200).json({
      isSuccess: true,
      group
    });
  } catch (err) {
    return next(err);
  }
};

GroupController.addMembers = async (req, res, next) => {
  try {
    const id = req.params.id;
    const membersAdded = req.body.members;
    let group = await Group.findById(id);
    // check member từ client gửi lên đã tồn tại trong group hay chưa
    let listMembersId = group.members.map(member => member._id.toHexString());
    for (let id of membersAdded) {
      if (listMembersId.includes(id)) {
        return next(new Error('Have a member existed in group!!!'));
      }
    }
    group.members = group.members.concat(membersAdded);
    await group.save();
    return res.status(200).json({ group });
  } catch (err) {
    return next(err);
  }
};

GroupController.deleteMembers = async (req, res, next) => {
  try {
    const id = req.params.id;
    const group = await Group.findById(id);
    if (!group) {
      return res.status(400).json({
        isSuccess: false,
        message: 'Group not found'
      });
    }
    const { mems } = req.body;
    if (!mems) {
      res.status(400).json({ message: 'mems is required' })
    }

    group.members.splice(group.members.indexOf(mems), 1);
    await group.save();
    return res.status(200).json({
      isSuccess: true,
      message: 'Deleted member'
    });

  } catch (err) {
    return next(err);
  }
};
// delete user
GroupController.delete = async (req, res, next) => {
  try {
    const id = req.params.id;
    let group = await Group.findById(id);

    if (!group) {
      return next(new Error('Group not found'));
    }

    group.deletedAt = new Date();

    await group.save();
    return res.status(200).json({ message: 'Deleted Successly!' });
  } catch (err) {
    return next(err);
  }
};

export default GroupController;