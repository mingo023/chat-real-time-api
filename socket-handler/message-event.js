import { MessageController } from '../api/controllers';
import helper from './helper';

export default class MessageHandler {
  static initEvent(socket, io) {
    socket.on('sendingMessage', async function (data, callback) {
      console.log('Get data on event sendingMessage');

      try {
        await MessageController.create({
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
      };

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
        const isUserExistInGroup = await helper.checkUserExistInGroup(data.id, socket.user._id);
        if (isUserExistInGroup) {
          const messages = await MessageController.getMessagesByGroup({
            params: {
              group: data.id
            }
          });
          return callback(null, { messages: messages.reverse(), user: socket.user._id });
        }
        return callback('Group not is exist');
      } catch (e) {
        console.log(e);
        if (callback) {
          return callback(e.message);
        }
      }
    });
  };
};
