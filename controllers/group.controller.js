import Group from '../models/group';
import User from '../models/user';
import { set, Model } from 'mongoose';

const GroupController = {};


GroupController.getAll = async (req, res, next) => {
  try {
    const groups = await Group.find().sort('-dateAdded');
    if (!groups.length) { return next(new Error('Groups not found!')) };
    return res.json({
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
    const group = await Group.findOne({ _id: id });
    return group ? res.json({ isSuccess: true, group }) : next(new Error('Group not found'));
  } catch (err) {
    return next(err);
  };
};

GroupController.addGroup = async (req, res, next) => {
  try {
    const infoGroup = req.body;
    const author = await User.findById(infoGroup.author);
    console.log(author);
    if (!author) {
      return next(new Error('This author is not user'));
    }
    const group = new Group(infoGroup);
    // save user to db
    await group.save();
    return res.json({
      isSuccess: true,
      group
    });
  } catch (err) {
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
    return res.json({
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
    group.deleteAt = new Date();
    await group.save();
    return res.json({ message: 'Deleted Successly!' });
  } catch (err) {
    return next(err);
  }
};


export default GroupController;