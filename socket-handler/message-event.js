import { MessageController } from '../api/controllers';
import JWT from 'jsonwebtoken';

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
        data = {
          user: socket.user,
          author: socket.user,
          group: socket.group,
          messages: data.message,
          token: socket.token
        };
        io.to(socket.group._id).emit('sendingMessage', data);
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
        console.log(messages);
        socket.payload = payload;
        socket.emit('loadingMessages', { messages: messages.reverse(), user: socket.user._id });
      } catch (e) {
        console.log(e);
        if (callback) {
          return callback(e.message);
        }
      }
    });
  };
};
