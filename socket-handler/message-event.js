import { MessageController } from '../api/controllers';

export default class MessageHandler {
  static initEvent(socket) {
    socket.on('sendingMessage', async function (data, callback) {
      console.log('Get data on event sendingMessage');
      console.log(data);

      try {
        const message = await MessageController.create({
          user: socket.user,
          body: {
            messages: data.message,
            group: socket.group
          }
        });

        return callback(null, message);
      } catch (e) {
        console.log(e);
        if (callback) {
          return callback(e.message);
        }
      }
      socket.broadcast.emit('sendingMessage', data);
    });

    socket.on('sendingTyping', function (data) {
      console.log('Get data on event sendingTyping');
      console.log(data);
    });
  };
};
