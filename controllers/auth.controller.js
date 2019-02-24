import path from 'path';
import { userRepository } from '../repositories';
import bcrypt from 'bcrypt';
import JWT from 'jsonwebtoken';

export default class Auth {
  
  static async login(req, res, next) {
    res.sendFile(path.resolve(__dirname, '../views/login/index.html'));
  };

  static async postLogin(req, res, next) {
    try {
      
      const { email, password } = req.body;
      
      const options = {
        where: { email },
        lean: true
      };
      const user = await userRepository.get(options);
      if (!user) {
        return res.sendFile(path.resolve(__dirname, '../views/login/index.html'));
      
      }
      
      const isCorrectPassword = await bcrypt.compare(password, user.password);
      if (!isCorrectPassword) {
        return res.sendFile(path.resolve(__dirname, '../views/login/index.html'));
        
      }
      
      delete user.password;
      const token = await JWT.sign(user, process.env.KEY_JWT);
      res.cookie('token', token);
      return res.sendFile(path.resolve(__dirname, '../views/index.html'));
    } catch (err) {
      return next(err);
    }
  };
};