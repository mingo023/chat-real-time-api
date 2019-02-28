import { UserController } from '../api/controllers';

export default class UserHandler {
  static gettingFriends(socket) {
    socket.on('gettingFriends', async function (data, callback) {
      try {
        const users = await UserController.getAll({});
        // socket.group = group;
        socket.emit('gettingFriends', users);
        return callback(null, group);
      } catch (e) {
        console.log(e);
        if (callback) {
          return callback(e.message);
        }
      }
    });
  };
};