import User from '../models/user';
import { set, Model } from 'mongoose';

const UserController = {};

// get all users from database
UserController.getAll = async (req, res, next) => {
  try {
    const users = await User.find().sort('-dateAdded');
    if (!users.length) { return next(new Error('Users not found!')) };
    return res.json({
      isSuccess: true,
      users
    });
  } catch (err) {
    return next(err);
  }
};

// get user by first name
UserController.getUser = async (req, res, next) => {
  try {
    const id = req.params.id;
    const user = await User.findOne({ _id: id });
    return user ? res.json({ isSuccess: true, user }) : next(new Error('User not found'));
  } catch (err) {
    return next(err);
  };
};
// add new user to database
UserController.addUser = async (req, res, next) => {
  try {
    const infoUser = req.body;
    const user = new User(infoUser);
    // save user to db
    await user.save();
    return res.json({
      isSuccess: true,
      user
    });
  } catch (err) {
    return next(err);
  };
};

// update info user
UserController.updateUser = async (req, res, next) => {
  try {
    const id = req.params.id;
    const infoUpdate = req.body;

    let user = await User.findOne({ _id: id });
    if (!user) {
      return next(new Error('User not found'));
    }
    Object.assign(user, infoUpdate);
    await user.save();
    return res.json({
      isSuccess: true,
      user
    });
  } catch (err) {
    return next(err);
  }
};
// delete user
UserController.deleteUser = async (req, res, next) => {
  try {
    const id = req.params.id;
    let user = await User.findById(id);

    if (!user) {
      return next(new Error('User not found'));
    }
    user.isDelete = true;
    await user.save();
    return res.json({ message: 'Deleted Successly!' });
  } catch (err) {
    return next(err);
  }
};

export default UserController;
