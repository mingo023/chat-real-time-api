import { UserController } from '../api/controllers';

export default class UserHandler {
  static gettingFriends(socket) {
    socket.on('gettingFriends', async function (data, callback) {
      try {
        let users = await UserController.getAll({});
        users = users.filter(user => user._id.toString() !== socket.user._id.toString());
        socket.emit('gettingFriends', users);
        return callback(null, users);
      } catch (e) {
        console.log(e);
        if (callback) {
          return callback(e.message);
        }
      }
    });
  };
};