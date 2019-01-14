import mongoose from 'mongoose';
import User from './user';
import Group from './group';

const Schema = mongoose.Schema;

const messageSchema = new Schema({
  author: {
    type: mongoose.Types.ObjectId,
    ref: 'User'
  },
  messages: {
    type: String,
    min: [1, 'Message khong duoc trong'],
    max: [255, 'Message qua dai']
  },
  group: {
    type: mongoose.Types.ObjectId,
    ref: 'Group'
  },
  deletedAt: {
    type: Date,
    default: null
  }
}, { timestamps: { createdAt: 'createdAt' } });

function preFindMiddleware(query) {
  return query.deletedAt = null;
}

messageSchema.pre('find', function() {
  preFindMiddleware(this.getQuery());
});

messageSchema.pre('findOne', function() {
  preFindMiddleware(this.getQuery());
});

messageSchema.pre('findOneAndUpdate', function() {
  preFindMiddleware(this.getQuery());
});

messageSchema.pre('save', async function (next) {
  // check author exist in db  
  const author = await User.findOne({ _id: this.author });
  if (!author) {
    return next(new Error('Author is not exist in db'));
  }
  const group = await Group.findOne({ _id: this.group });
  if (!group) {
    return next(new Error('Group is not exist in db'));
  }
});

const Message = mongoose.model('Message', messageSchema);

export default Message;