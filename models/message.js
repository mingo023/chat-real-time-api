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

function findMiddleware(query) {
  return query.deletedAt = null;
};

messageSchema.pre('find', function() {
  const query = this.getQuery();
  findMiddleware(query);
});

messageSchema.pre('findOne', function() {
  const query = this.getQuery();
  query.deletedAt = null;
});

messageSchema.pre('findOneAndUpdate', function() {
  const query = this.getQuery();
  query.deletedAt = null;
});

messageSchema.pre('save', async function (next) {
  // check author exist in db  
  const author = await User.findOne({ _id: this.author });
  if (!author) {
    return next(new Error('Author is not exist in db'));
  }
  
});

const Message = mongoose.model('Message', messageSchema);

export default Message;