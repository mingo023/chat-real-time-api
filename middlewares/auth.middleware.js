import JWT from 'jsonwebtoken';
import User from '../models/user';

module.exports.requireAuth = async (req, res, next) => {
  try {
    const { token } = req.headers;
    if (!token) {
      return next(new Error('Not found authentication'));
    }
    const data = await JWT.verify(token, '77yIw21VsG');
    const _id = data._id;
    const user = await User.findById(_id);
    if (!user) {
      return next(new Error('User not found'));
    }
    next();
  } catch (err) {
    return next(err);
  }
};