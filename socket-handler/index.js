import authEvent from './auth-event';
import messageEvent from './message-event';
import groupEvent from './group-event';

module.exports.initSocket = async (server) => {
  // const userAccesses = [];
  const io = require('socket.io')(server);
  io
  .use(async function (socket, next) {
    try {
      await authEvent.auth(socket, next);
    } catch (e) {
      return next(e);
    }
  })
  .on('connection', function (socket, next) {
    socket.join('some room');
    messageEvent.initEvent(socket);
    groupEvent.initEvent(socket);

    socket.on('disconnect', function () {
      console.log('user disconnected');
    });
  });
};