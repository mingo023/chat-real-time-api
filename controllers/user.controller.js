import User from '../models/user';
import { set, Model } from 'mongoose';

const UserController = {};

// get all users from database
UserController.getAll = async (req, res) => {
  try {
    const users = await User.find().sort('-dateAdded');
    if (!users) {
      return res.json({
        isSuccess: false,
        message: 'User not found!'
      });
    }
    return res.json({
      isSuccess: true,
      users
    })
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
    const id = req.params.id;
    const user = await User.findOne({ _id: id });

    return user ? res.json({ isSuccess:true, user }) : res.json({ isSuccess: false, message: 'User not found'});
  } catch (err) {
    return res.json({ message: 'User not found',error: err });
  };
};

// add new user to database
UserController.addUser = async (req, res) => {
  try {
    // get properties of user 
    const infoUser = req.body;
    console.log(infoUser);
    // validate email 
    if (!infoUser.firstName) {
      return res.status(400).json({
        isSuccess: false,
        error: {
          message: 'First name is required field'
        }
      });
    }
    if (!infoUser.lastName) {
      return res.status(400).json({
        isSuccess: false,
        error: {
          message: 'Last name is required field'
        }
      });
    }
    if (!infoUser.phone) {
      return res.status(400).json({
        isSuccess: false,
        error: {
          message: 'Phone is required field'
        }
      });
    }
    if (!infoUser.age) {
      return res.status(400).json({
        isSuccess: false,
        error: {
          message: 'Age is required field'
        }
      });
    }
    if (!infoUser.email) {
      return res.status(400).json({
        isSuccess: false,
        error: {
          message: 'email is required field'
        }
      });
    }
    // create new user
    const user = new User( infoUser );
    // console.log(user);
    // save user to db
    await user.save();
    return res.json({
      isSuccess: true,
      user
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
    const id = req.params.id;
    const infoUpdate = req.body;
    if (!infoUpdate.firstName) {
      return res.json({ message: 'First name is required !' });
    }
    if (!infoUpdate.lastName) {
      return res.json({ message: 'Last name is required !' });
    }
    if (!infoUpdate.phone) {
      return res.json({ message: 'Phone is required !' });
    }
    if (!infoUpdate.age) {
      return res.json({ message: 'Age is required !' });
    }
    if (!infoUpdate.email) {
      return res.json({ message: 'Email is required !' });
    }
    let user = await User.findOne({ _id: id });
    if (!user) {
      return res.json({
        isSuccess: false,
        message: 'User not found!'
      });
    }
    Object.assign(user, infoUpdate);
    await user.save();
    return res.json({ 
      isSuccess: true,
      user
    });
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
    const id = req.params.id;
    let user = await User.findById(id);
    console.log(user);
    if (!user) {
      return res.json({ message: 'User not found!' });
    }
    user.isDelete = true;
    await user.save();
    return res.json({ message: 'Deleted Successly!' });
  } catch (err) {
    return res.json({
      isSuccess: false,
      error: err.message
    })
  }
};

export default UserController;
