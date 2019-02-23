import JWT from 'jsonwebtoken';
import { userRepository } from '../repositories';

module.exports.requireAuth = async (req, res, next) => {
  try {
    const { socket } = req;
    const { token } = req.query ||req.headers || req.body;
    if (!token) {
      return next(new Error('Not found authentication'));
    }
    const tokens = token.split('Bearer ');
    if (tokens.length !== 2 || tokens[0] !== '') {
      return next(new Error('Not authentication format!'));
    }
    const authToken = tokens[1];
    const data = await JWT.verify(authToken, process.env.KEY_JWT);

    const options = {
      where: { _id: data._id },
      select: '_id password email',
      lean: true
    }
    const user = await userRepository.get(options);
    if (!user) {
      return next(new Error('User is not valid'));
    }
    // pass data to next middleware
    req.user = user;
    if (socket) {
      socket.user = user;
    }
    return next();
  } catch (err) {
    return next(err);
  }
};