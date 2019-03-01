import { requireAuth } from '../middlewares/auth-middleware';

export default class authHandler {
  static async auth(socket, next) {
    const { token } = socket.handshake.query;
    if (!token) {
      return next(new Error('Token not found!'));
    }
    socket.token = token.split('Bearer ')[1];
    const req = {
      socket,
      query: { token }
    };
    try {
      await requireAuth(req, null, next);
    } catch (err) {
      return next(err);
    }
  };
};
