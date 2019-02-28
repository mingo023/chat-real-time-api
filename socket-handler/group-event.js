import { GroupController } from '../api/controllers';

export default class GroupHandler {
  static creatingGroup(socket) {
    socket.on('creatingGroup', async function (data, callback) {
      try {
        const group = await GroupController.create({
          user: socket.user,
          body: {
            members: [data],
            name: `` 
          }
        });
        socket.join(group._id); // handle event when client create new group then join this user to group;
        socket.group = group;
        return callback(null, group);
      } catch (e) {
        if (callback) {
          return callback(e.message);
        }
      }
    });
  };
  
  static joiningGroup(socket, io) {
    socket.on('joiningGroup', async function (data, callback) {
      try {
        const group = await GroupController.get({
          params: {
            id: data.groupId
          }
        });
        socket.group = group;
        return callback(null, group);
      } catch (e) {
        if (callback) {
          return callback(e.message);
        }
      }
    });
  };

  static gettingGroup(socket) {
    socket.on('gettingGroup', async function (data, callback) {
      try {
        const groups = await GroupController.getGroupByUser({
          user: socket.user
        });
        return callback(null, groups);
      } catch (e) {
        console.log(e);
        if (callback) {
          return callback(e.message);
        }
      }
    });
  };

  static async joinToGroup(socket) {
    const groups = await GroupController.getGroupByUser({
      user: { _id: socket.user }
    });
    if (groups.length > 0) {
      for (const item of groups) {
        socket.join(item._id);
      };
    };
  };

};