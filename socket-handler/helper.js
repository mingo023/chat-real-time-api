import { requireAuth } from '../middlewares/auth-middleware';
import { groupRepository } from '../repositories';

export default class Helper {
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

  static async checkUserExistInGroup(groupId, memberId) {
    try {
      return await groupRepository.get({
        where: {
          _id: groupId,
          members: memberId
        }
      }) !== null; 
    } catch (error) {
      console.log(error);
      return error;
    }
  };
};
