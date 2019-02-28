import { userRepository } from '../repositories';

export default class UserHandler {
  static gettingFriends(socket) {
    socket.on('gettingFriends', async function (data, callback) {
      try {
        const users = await userRepository.getAll({
          where: { _id: { $ne: socket.user._id } }
        });
        if (users > 0) {
          socket.emit('gettingFriends', users);
        }
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