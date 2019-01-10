import User from '../models/user';
import { set, Model } from 'mongoose';
import JWT from 'jsonwebtoken';
import bcrypt from 'bcrypt';

const saltRounds = 10;

const UserController = {};

UserController.getAll = async (req, res, next) => {
  try {
    const users = await User
      .find({})
      .select('-password')
      .lean(true);

    if (!users.length) {
      return next(new Error('Users not found!'))
    };

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
    const user = await User.findById(_id)
      .select('-password')
      .lean(true);

    if (!user) {
      return next(new Error('User not found!'));
    }

    return res.status(200).json({
      isSuccess: true,
      user
    });
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
    const user = await User.findById(_id)
      .select('-password')
      .lean(true);

    if (!user) {
      return next(new Error('User not found'));
    }

    await User.updateOne({ _id }, { $set: data });

    return res.status(200).json({
      isSuccess: true,
      user: { ...user, ...data }
    });
  } catch (err) {
    return next(err);
  }
};

UserController.delete = async (req, res, next) => {
  try {
    const _id = req.params.id;
    const user = await User.findById(_id).lean(true);
    if (!user) {
      return next(new Error('User not found'));
    }
    await User.updateOne({ _id }, { $set: { deletedAt: new Date() } });
    return res.status(200).json({ message: 'Deleted Successly!' });
  } catch (err) {
    return next(err);
  }
};

UserController.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    const user = await User
      .findOne({ email })
      .lean(true);
    if (!user) {
      return next(new Error('User not found!'));
    }

    const isCorrectPassword = await bcrypt.compare(password, user.password);
    if (!isCorrectPassword) {
      return next(new Error('Password is incorrect!'));
    }

    delete user.password;
    const token = await JWT.sign(user, process.env.KEY_JWT);
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
    const { _id, password } = req.user;
    const { currentPassword, newPassword, confirmedPassword } = req.body;

    if (newPassword !== confirmedPassword) {
      return next(new Error('Password does not match!'));
    }
    if (currentPassword === newPassword) {
      return next(new Error('New password must be different from current password!'));
    }

    const isCorrectPassword = await bcrypt.compare(currentPassword, password);
    if (!isCorrectPassword) {
      return next(new Error('Current password is incorrect!'));
    }

    const hashPassword = await bcrypt.hash(newPassword, saltRounds);
    await User.updateOne({ _id }, { $set: { password: hashPassword } });
    return res
      .status(200)
      .json({
        isSuccess: true,
        message: 'Password was changed'
      });
  } catch (err) {
    return next(err);
  }
};

export default UserController;
