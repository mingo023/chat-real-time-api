import authHandler from './helper';
import messageEvent from './message-event';
import groupEvent from './group-event';
import userEvent from './user-event';

module.exports.initSocket = async (server) => {

  const io = require('socket.io')(server);
  io
  .use(async function (socket, next) {
    try {
      await authHandler.auth(socket, next);
    } catch (e) {
      return next(e);
    }
  })
  .on('connection', function (socket, next) {


    messageEvent.initEvent(socket, io);
    messageEvent.sendingTyping(socket, io);
    messageEvent.loadingMessages(socket, io);
    
    groupEvent.creatingGroup(socket);
    groupEvent.joiningGroup(socket);
    groupEvent.gettingGroup(socket);
    groupEvent.joinToGroup(socket);

    userEvent.gettingFriends(socket);

    socket.on('disconnect', function () {
      console.log('user disconnected');
    });
  });
};