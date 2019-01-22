import { userRepository } from '../repositories';

module.exports.checkBlock = async (req, res, next) => {
  try {

    const _id = req.user._id;
    const user = await userRepository.get({
      where: { _id },
      select: 'blockedAt startUpload countUpload'
    });

    const isOverTime = (new Date() - user.startUpload) / 1000 / 60 > 1;

    if (isOverTime) {
      user.blockedAt = null;
      user.countUpload = 0;
      user.startUpload = new Date();
    } else {
      if (user.blockedAt) { 
        return next(new Error(`You was blocked, pls wait ${10 - (new Date() - user.blockedAt) / 1000 / 60} mins`));
      };
      if (user.countUpload > 3) {
        user.blockedAt = new Date();
        user.startUpload = new Date();
        await user.save();
        return next(new Error('You was blocked!, pls wait 10mins'))
      };
      user.countUpload++;
    };
    await user.save();
    next();

  } catch (err) {
    return next(err);
  }
};