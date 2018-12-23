import User from '../models/user';
import { set } from 'mongoose';

const UserController = {};

// get all users from database
UserController.getAll = async (req, res) => {
  try {
    await User.find().sort('-dateAdded').exec((err, users) => {
      if (err) {
        res.status(500).send(err);
      }
      return res.json({
        users,
      });
    });
  } catch (err) {
    return res.status(400).json({
      isSuccess: false,
      message: err.message,
      error: err
    });
  }
};

// get user by first name
UserController.getUser = async (req, res) => {
  try {
    let userName = req.params.name;
    let user = await User.find({ firstName: userName });
    if (!userName) {
      return res.json({ message: 'Username is required' });
    }
    return res.json({ user });
  } catch (err) {
    return res.json({
      message: 'User not found',
      error: err
    });
  };
};

// add new user to database
UserController.addUser = async (req, res) => {
  try {
    // get properties of user 
    const { firstName, lastName, phone, age, email } = req.body;
    // validate email 
    if (!email) {
      return res.status(400).json({
        isSuccess: false,
        error: {
          message: 'email is required field'
        }
      });
    }
    // create new user
    const user = new User({
      firstName,
      lastName,
      phone,
      age,
      email
    });
    // save user to db
    await user.save((err, user) => {
      if (err) {
        return res.json({ message: 'Can not save user to db' });
      }
      return res.json({
        isSuccess: true,
        user
      });
    });
  } catch (err) {
    return res.status(400).json({
      isSuccess: false,
      message: err.message,
      error: err
    });
  }
};

// update info user
UserController.updateUser = async (req, res) => {
  try {
    let userName = req.params.name;
    let nameUpdate = req.body.firstName;
    let user = await User.find({ firstName: userName });

    if (user.length) {
      await User.updateMany({ firstName: userName }, { firstName: nameUpdate });
      return res.json({ message: 'Successful' });
    }
    return res.json({ message: 'Can not find user to update' });
  } catch (err) {
    return res.json({
      message: 'Can not update user',
      error: err
    });
  }
};
// delete user
UserController.deleteUser = async (req, res) => {
  try {
    let userName = req.params.name;
    await User.findOneAndDelete({ firstName: userName }, (err) => {
      if (err) {
        return res.json({ message: err });
      }
      return res.json({ message: 'Successful!' });
    });
  } catch (err) {
    return res.json({
      message: 'Can not delete user',
      error: err
    })
  }
};

export default UserController;
