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
        users
      });
    });
  } catch (err) {
    return res.status(400).json({
      isSuccess: false,
      message: err.message
    });
  }
};

// get user by first name
UserController.getUser = async (req, res) => {
  try {
    let id = req.params.id;
    if (!id) {
      return res.json({ message: 'Id is required' });
    }
    let user = await User.findById(id);
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
    if (!firstName) {
      return res.status(400).json({
        isSuccess: false,
        error: {
          message: 'First name is required field'
        }
      });
    }
    if (!lastName) {
      return res.status(400).json({
        isSuccess: false,
        error: {
          message: 'Last name is required field'
        }
      });
    }
    if (!phone) {
      return res.status(400).json({
        isSuccess: false,
        error: {
          message: 'Phone is required field'
        }
      });
    }
    if (!age) {
      return res.status(400).json({
        isSuccess: false,
        error: {
          message: 'Age is required field'
        }
      });
    }
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
    await user.save();
    return res.json({ 
      isSuccess: true,
      user: user
    })
  } catch (err) {
    return res.status(400).json({
      isSuccess: false,
      message: err.message
    });
  };
};

// update info user
UserController.updateUser = async (req, res) => {
  try {
    let id = req.params.id;
    let { firstName, lastName, phone, age, email } = req.body;
    if (!firstName) {
      return res.json({ message: 'First name is required !' });
    }
    if (!lastName) {
      return res.json({ message: 'Last name is required !' });
    }
    if (!phone) {
      return res.json({ message: 'Phone is required !' });
    }
    if (!age) {
      return res.json({ message: 'Age is required !' });
    }
    if (!email) {
      return res.json({ message: 'Email is required !' });
    }
    await User.findByIdAndUpdate(id, req.body);
    return res.json({
      isSuccess: true,
      user: req.body
    })
  } catch (err) {
    return res.json({
      isSuccess: false,
      message: err.message
    })
  }
};
// delete user
UserController.deleteUser = async (req, res) => {
  try {
    let id = req.params.id;
    if (!id) {
      return res.json({ message: 'Id is required!' });
    }
    await User.findByIdAndDelete(id);
    return res.json({ isSuccess: true });
  } catch (err) {
    return res.json({
      isSuccess: false,
      error: err.message
    })
  }
};

export default UserController;
