import Message from '../models/message';
import { set, Model } from 'mongoose';
import Group from '../models/group';

const MessageController = {};

MessageController.getAll = async (req, res, next) => {
  try {
    const messages = await Message
      .find()
      .populate([
        {
          path: 'author',
          select: '-password'
        },
        {
          path: 'group',
        }
      ])
      .sort({ createdAt: -1 })
      .lean(true);
    if (!messages.length) { return next(new Error('Messages not found!')) };
    return res.status(200).json({
      isSuccess: true,
      messages
    });
  } catch (err) {
    return next(err);
  }
};

MessageController.get = async (req, res, next) => {
  try {
    const _id = req.params.id;
    const message = await Message
      .findOne({ _id })
      .populate([
        {
          path: 'author',
          select: '-password'
        },
        {
          path: 'group'
        }
      ])
      .lean(true);
    if (!message) {
      return next(new Error('Message not found!'));
    }
    return res.status(200).json({
      isSuccess: true,
      message
    });
  } catch (err) {
    return next(err);
  };
};

MessageController.create = async (req, res, next) => {
  try {
    const author = req.user._id;
    const { messages, group } = req.body;
    const member = await Group
      .findOne({
        _id: group,
        members: author
      });
    if (!member) {
      return next(new Error('You is not exist in this group!'));
    }
    
    const message = new Message({ author, messages, group });
    await message.save();

    return res.status(200).json({
      isSuccess: true,
      message
    });
  } catch (err) {
    return next(err);
  };
};

MessageController.update = async (req, res, next) => {
  try {
    const _id = req.params.id;
    const updateMessage = req.body;

    const message = await Message.findOneAndUpdate({ _id }, { $set: updateMessage });
    if (!message) {
      return next(new Error('Message not found!'));
    }
    return res.status(200).json({
      isSuccess: true,
      message: 'Updated successful'
    });
  } catch (err) {
    return next(err);
  }
};

MessageController.delete = async (req, res, next) => {
  try {
    const _id = req.params.id;
    const message = await Message.findOneAndUpdate({ _id }, { $set: { deletedAt: new Date() } });
    if (!message) {
      return next(new Error('Message not found!'))
    }
    return res.status(200).json({
      isSuccess: true,
      message: 'Deleted Successly!'
    });
  } catch (err) {
    return next(err);
  }
};

export default MessageController;