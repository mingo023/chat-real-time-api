import { userRepository } from '../repositories';
import User from '../models/user';
import JWT from 'jsonwebtoken';
import nodeMailer from 'nodemailer';

import bcrypt from 'bcrypt';
const saltRounds = 10;

import { ResponseHandler } from '../helper';

const UserController = {};

UserController.getAll = async (req, res, next) => {
  try {

    const options = {
      lean: true,
      select: '-password'
    }

    const users = await userRepository.getAll(options);

    if (!users.length) {
      return next(new Error('Users not found!'))
    };

    return ResponseHandler.returnSuccess(res, users);

  } catch (err) {
    return next(err);
  }
};

UserController.get = async (req, res, next) => {
  try {

    const options = {
      where: { _id: req.params.id },
      select: '-password',
      lean: true
    };

    const user = await userRepository.get(options);
    if (!user) {
      return next(new Error('User not found!'));
    }

    return ResponseHandler.returnSuccess(res, user);

  } catch (err) {
    return next(err);
  };
};

UserController.create = async (req, res, next) => {
  try {

    const hashPassword = await bcrypt.hash(req.body.password, saltRounds);
    const data = {
      ...req.body,
      password: hashPassword
    };

    const user = userRepository.create(data);
    await user.save();

    delete user._doc.password;

    return ResponseHandler.returnSuccess(res, user);

  } catch (err) {
    return next(err);
  };
};

UserController.update = async (req, res, next) => {
  try {

    const options = {
      where: { _id: req.params.id },
      data: { $set: req.body },
      lean: true
    }

    const user = await userRepository.findOneAndUpdate(options);
    if (!user) {
      return next(new Error('User not found'));
    }

    return ResponseHandler.returnSuccess(res, { message: 'Updated user successly!' });

  } catch (err) {
    return next(err);
  }
};

UserController.delete = async (req, res, next) => {
  try {

    const options = {
      where: { _id: req.params.id },
      data: { $set: { deletedAt: new Date() } },
      lean: true
    }
    const user = await userRepository.findOneAndUpdate(options);
    if (!user) {
      return next(new Error('User not found!'));
    }
    return ResponseHandler.returnSuccess(res, { message: 'Deleted user successly!' });

  } catch (err) {
    return next(err);
  }
};

UserController.login = async (req, res, next) => {
  try {

    const { email, password } = req.body;
    const options = {
      where: { email },
      lean: true
    };
    const user = await userRepository.get(options);
    if (!user) {
      return next(new Error('User not found!'));
    }

    const isCorrectPassword = await bcrypt.compare(password, user.password);
    if (!isCorrectPassword) {
      return next(new Error('Password is incorrect!'));
    }

    delete user.password;
    const token = await JWT.sign(user, process.env.KEY_JWT);
    return ResponseHandler.returnSuccess(res, {
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
    
    const options = {
      where: { _id },
      data: { $set: { password: hashPassword } }
    };

    await userRepository.updateOne(options);

    return ResponseHandler.returnSuccess(res, { message: 'Your password have been changed!' });

  } catch (err) {
    return next(err);
  }
};

UserController.forgotPassword = async (req, res, next) => {
  try {
    const email = req.body.email;
    const user = await userRepository.get({
      where: { email: email },
      select: '_id',
      lean: true
    });

    if (!user) {
      return next(new Error('User not found!'));
    };

    const token = await JWT.sign(user, process.env.KEY_JWT);

    const transporter = nodeMailer.createTransport({
      host: 'smtp.gmail.com',
      port: 465,
      secure: true,
      auth: {
        user: 'nvminh023@gmail.com',
        pass: process.env.PASS_SMTP
      }
    }); 

    const mailOptions = {
      from: '"Minh"',
      to: email,
      subject: 'Reset Your Password',
      html: `<b><a href="localhost:3000/forgot-password/${token}">Link</a></b>`
    };

    transporter.sendMail(mailOptions, (error, info) => {
      if (error) {
        return next(error);
      }
      return ResponseHandler.returnSuccess(res, {
        message: 'Successly'
      });
    });

  } catch(err) {
    return next(err);
  }
} 

UserController.resetPassword = async (req, res, next) => {
  try {

    const token = req.params.token;
    const newPassword = req.body.password;
    const data = await JWT.verify(token, process.env.KEY_JWT);
    const hashPassword = await bcrypt.hash(newPassword, saltRounds);
    const user = await userRepository.findOneAndUpdate({
      where: { _id: data._id },
      data: { $set: { password: hashPassword }}
    });

    if (!user) {
      return next(new Error('Cannot reset password'));
    };

    return ResponseHandler.returnSuccess(res, {
      message: 'Successly!'
    });
  } catch (err) {
    return next(err);
  }

};

export default UserController;
