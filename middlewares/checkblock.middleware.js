import { userRepository } from '../repositories';

module.exports.checkBlock = async (req, res, next) => {
  try {

    const _id = req.user._id;
    const user = await userRepository.get({
      where: { _id },
      select: 'isBlock lastUploaded countUpload'
    });

    const isOverTime = (new Date() - user.lastUploaded) / 1000 / 60 > 1;
    
    if (isOverTime) {
      user.isBlock = false;
      user.countUpload = 0;
      user.lastUploaded = new Date();
    } else {
      if (user.isBlock) { return next(new Error('You was blocked!')) };
      if (user.countUpload > 3) {
        user.isBlock = true;
        user.lastUploaded = new Date();
        await user.save();
        return next(new Error('You was blocked, pls wait 10mins!'));
      };
      user.countUpload++;
    };
    await user.save();
    next();

  } catch (err) {
    return next(err);
  }
};