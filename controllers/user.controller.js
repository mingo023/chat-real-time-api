import User from '../models/user';
import { set, Model } from 'mongoose';
import md5 from 'md5';
import JWT from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const saltRounds = 10;

const UserController = {};

UserController.getAll = async (req, res, next) => {
  try {
    const users = await User.find();
    if (!users.length) { return next(new Error('Users not found!')) };
    return res.status(200).json({
      isSuccess: true,
      users
    });
  } catch (err) {
    return next(err);
  }
};

UserController.get = async (req, res, next) => {
  try {
    const _id = req.params.id;
    const user = await User.findOne({ _id });
    return user ? res.status(200).json({ isSuccess: true, user }) : next(new Error('User not found'));
  } catch (err) {
    return next(err);
  };
};

UserController.create = async (req, res, next) => {
  try {
    const { gender, fullName, email, password } = req.body;
    const hashPassword = await bcrypt.hash(password, saltRounds);
    const user = new User({
      gender,
      fullName,
      email,
      password: hashPassword
    });
    // save user to db
    await user.save();
    delete user._doc.password;
    return res.status(200).json({
      isSuccess: true,
      user
    });
  } catch (err) {
    return next(err);
  };
};

UserController.update = async (req, res, next) => {
  try {
    const _id = req.params.id;
    const data = req.body;
    const user = await User.findOne({ _id });
    if (!user) {
      return next(new Error('User not found'));
    }
    if (data.password !== undefined) {
      data.password = md5(data.password);
    }
    user.set(data);
    await user.save();
    return res.status(200).json({
      isSuccess: true,
      user
    });
  } catch (err) {
    return next(err);
  }
};

UserController.delete = async (req, res, next) => {
  try {
    const _id = req.params.id;
    let user = await User.findOne({ _id });

    if (!user) {
      return next(new Error('User not found'));
    }
    user.isDelete = true;
    await user.save();
    return res.status(200).json({ message: 'Deleted Successly!' });
  } catch (err) {
    return next(err);
  }
};

UserController.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User.findOne({ email });
    if (!user) {
      return next(new Error('User not found!'));
    }

    const isCorrectPassword = await bcrypt.compare(password, user._doc.password);
    if (!isCorrectPassword) {
      return next(new Error('Password is incorrect!'));
    }

    delete user._doc.password;
    const token = await JWT.sign(user._doc, process.env.KEY_JWT);
    return res.status(200).json({
      isSuccess: true,
      user,
      token
    });
  } catch (err) {
    return next(err);
  }
};

UserController.changePassword = async (req, res, next) => {
  try {
    const _id = req.params.id;
    const { oldPassword, newPassword, confirmedPassword } = req.body;
    const user = await User.findOne({ _id });
    const isCorrectPassword = await bcrypt.compare(oldPassword, user._doc.password);

    if (!isCorrectPassword) {
      return next(new Error('Old password is incorrect!'));
    }
    if (newPassword !== confirmedPassword) {
      return next(new Error('Password does not match!'));
    }
    if (oldPassword === newPassword) {
      return next(new Error('New password must be different from old password!'));
    }
    const hashPassword = await bcrypt.hash(newPassword, saltRounds);
    user.password = hashPassword;
    await user.save();
    return res
      .status(200)
      .json({
        isSuccess: true,
        message: 'Password was changed'
      })
  } catch (err) {
    return next(err);
  }
};

export default UserController;
