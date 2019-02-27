import { GroupController } from '../api/controllers';

export default class GroupHandler {
  static initEvent(socket) {
    socket.on('creatingGroup', async function (data, callback) {
      try {
        const group = await GroupController.create({
          user: socket.user,
          body: data
        });
        socket.group = group;
        socket.broadcast.emit('sendingMessage', data.name);
        return callback(null, group);
      } catch (e) {
        console.log(e);
        if (callback) {
          return callback(e.message);
        }
      }
    });
    socket.on('joiningGroup', async function(data, callback) {
      try {
        const group = await GroupController.get({
          params : {
            id: data.groupId
          }
        });
        socket.group = group;
      } catch (e) {
        if (callback) {
          return callback(e.message);
        }
      }
    });

    socket.on('gettingGroup', async function(data, callback) {
      try {
        const groups = await GroupController.getGroupByUser({
          user: socket.user
        });
        socket.emit('gettingGroup', groups);
      } catch (e) {
        console.log(e);
        if (callback) {
          return callback(e.message);
        }
      }
    });
  };
};