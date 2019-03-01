import path from 'path';

export default class SignUpController {
  
  static async signup(req, res, next) {
    res.sendFile(path.resolve(__dirname, '../views/sign-up/index.html'));
  }
  // static async login(req, res, next) {
  //   res.sendFile(path.resolve(__dirname, '../views/login/index.html'));
  // }
};