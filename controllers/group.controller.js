import Group from '../models/group';
import User from '../models/user';
import { set, Model } from 'mongoose';

const GroupController = {};

GroupController.getAll = async (req, res, next) => {
  try {
    const groups = await Group.find().sort('-dateAdded');
    if (!groups.length) { return next(new Error('Groups not found!')) };
    return res.status(200).json({
      isSuccess: true,
      groups
    });
  } catch (err) {
    return next(err);
  }
};

GroupController.getGroup = async (req, res, next) => {
  try {
    const id = req.params.id;
    const group = await Group
      .findOne({ _id: id })
      .populate('author')
      .populate('members');
    return group ? res.status(200).json({ isSuccess: true, group }) : next(new Error('Group not found'));
  } catch (err) {
    return next(err);
  };
};

GroupController.addGroup = async (req, res, next) => {
  try {
    const { name, author, members } = req.body;
    const group = new Group({ name, author, members });
    // save user to db
    const createdGroup = await group.save();
    return res.status(200).json({
      isSuccess: true,
      group: createdGroup
    });
  } catch (err) {
    console.log(err);
    return next(err);
  };
};

GroupController.updateGroup = async (req, res, next) => {
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
// delete user
GroupController.deleteGroup = async (req, res, next) => {
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