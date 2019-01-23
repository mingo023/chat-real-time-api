import { userRepository } from '../repositories';

module.exports.checkBlock = async (req, res, next) => {
  try {

    const _id = req.user._id;
    const user = await userRepository.get({
      where: { _id },
      select: 'blockedAt startUpload countUpload'
    });

    const isOverTime = (new Date() - user.startUpload) / 1000 / 60 > 1;

    if (user.blockedAt) {//check hết thời gian block ? set lại mặc định : trả về lỗi

      if ((new Date() - user.blockedAt) / 1000 / 60 > 2) { 
        user.countUpload = 0;
        user.blockedAt = null;
        user.startUpload = new Date();
      } else {
        return next(new Error(`You was blocked, pls wait ${2 - (new Date() - user.blockedAt) / 1000 / 60} mins`));
      }

    } else {
      // check thử hết thời gian quy định cho 1p upload ? set lại count = 0; startUpload
      if (isOverTime) {
        user.countUpload = 0;
        user.startUpload = new Date();
      } else if (user.countUpload > 3) {//nếu dưới 1p mà quá số lần upload => block
        user.blockedAt = new Date();
        await user.save();
        return next(new Error('You was blocked!, pls wait 10mins'))
      };
    };
    user.countUpload++;
    await user.save();
    next();

  } catch (err) {
    return next(err);
  }
};