import path from 'path';
import { userRepository } from '../repositories';
import bcrypt from 'bcrypt';
import JWT from 'jsonwebtoken';

export default class SignUpController {

  static async signup(req, res, next) {
    res.sendFile(path.resolve(__dirname, '../views/sign-up/index.html'));
  }

  static async register(req, res, next) {
    try {
      const { first, last, email, password } = req.body;
      if (!first || !last || !email || !password) {
        res.redirect('/signup');
      }
      const passwordHashed = await bcrypt.hash(password, 10);
      const formatInfo = {
        fullName: {
          first,
          last
        },
        email,
        password: passwordHashed,
      };
      let user = await userRepository.create(formatInfo);
      await user.save();
      
      user = user._doc;
      delete user.password;

      const token = await JWT.sign(user, process.env.KEY_JWT);
      res.cookie('token', 'Bearer ' + token);
      res.redirect('/');
    } catch (error) {
      console.log(error);
    }
  };
};