import path from 'path'
export default class ChatController {
  
  static async chat(req, res, next) {
    res.sendFile(path.resolve(__dirname, '../views/index.html'));
  }
  static async login(req, res, next) {
    res.sendFile(path.resolve(__dirname, '../views/login/index.html'));
  }
};