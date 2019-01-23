import { userRepository } from '../repositories';
import { ResponseHandler } from '../helper';
import JWT from 'jsonwebtoken';

import MailService from '../service/mail-service';

import bcrypt from 'bcrypt';
const saltRounds = 10;

export default class UserController {

  static async getAll(req, res, next) {
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

  static async get(req, res, next) {
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
    }
  };

  static async create(req, res, next) {
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
    }
  };

  static async update(req, res, next) {
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

  static async delete(req, res, next) {
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

  static async login(req, res, next) {
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

  static async changePassword(req, res, next) {
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

  static async forgotPassword(req, res, next) {
    try {
      const email = req.body.email;

      const user = await userRepository.get({
        where: { email: email },
        select: '_id'
      });
      if (!user) {
        return next(new Error('User not found!'));
      };
      const randomCode = Math.random().toString(36).substring(2,7);

      await MailService.sendMail(
        'Ngo Minh',
        email,
        'Reset Your Password',
        'reset password',
        `<p>Hãy nhập mã code nào vào form để đặt lại mật khẩu mới <h1>${randomCode}</h1></p>`
      );
      return ResponseHandler.returnSuccess(res, {
        message: 'Successly!'
      });
    } catch (err) {
      return next(err);
    }
  };

  static async resetPassword(req, res, next) {
    try {

      const token = req.params.token;
      const newPassword = req.body.password;
      const data = await JWT.verify(token, process.env.KEY_JWT);
      const hashPassword = await bcrypt.hash(newPassword, saltRounds);
      const user = await userRepository.findOneAndUpdate({
        where: { _id: data._id },
        data: { $set: { password: hashPassword } }
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

}


