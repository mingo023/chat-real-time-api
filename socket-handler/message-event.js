import { MessageController } from '../api/controllers';
import JWT from 'jsonwebtoken';

export default class MessageHandler {
  static initEvent(socket) {
    socket.on('sendingMessage', async function (data, callback) {
      console.log('Get data on event sendingMessage');
      try {
        const message = await MessageController.create({
          user: socket.user,
          body: {
            messages: data.message,
            group: socket.group
          }
        });
        console.log(data);
        socket.broadcast.emit('sendingMessage', data);
        return callback(null, message);
      } catch (e) {
        if (callback) {
          return callback(e.message);
        }
      }
    });

    socket.on('sendingTyping', function (data) {
      console.log('Get data on event sendingTyping');
      console.log(data);
    });

    socket.on('loadingMessages', async function(data, callback) {
      try {
        const messages = await MessageController.getMessagesByGroup({
          params: {
            group: data.id
          }
        });
        const payload = await JWT.decode(data.token);
        
        socket.emit('loadingMessages', { messages: messages.reverse(), user: payload._id });
      } catch (e) {
        console.log(e);
        if (callback) {
          return callback(e.message);
        }
      }
    });
  };
};
