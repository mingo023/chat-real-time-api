import { MessageController } from '../api/controllers';
import JWT from 'jsonwebtoken';

// const io = require('socket.io')(server);

export default class MessageHandler {
  static initEvent(socket, io) {
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
        io.to(socket.group._id).emit('sendingMessage', data);
        return callback(null, message);
      } catch (e) {
        if (callback) {
          return callback(e.message);
        }
      }
    });   
  };

  static sendingTyping(socket, io) {
    socket.on('sendingTyping', function (data) {
      console.log('Get data on event sendingTyping');
      console.log(data);
    });
  };

  static loadingMessages(socket, io) {
    socket.on('loadingMessages', async function (data, callback) {
      try {
        const messages = await MessageController.getMessagesByGroup({
          params: {
            group: data.id
          }
        });
        const payload = await JWT.decode(data.token);
        socket.payload = payload;
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
