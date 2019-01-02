import mongoose from 'mongoose';
import User from './user';
import { runInNewContext } from 'vm';
let Schema = mongoose.Schema;
let ObjectId = mongoose.Types.ObjectId;

let groupSchema = new Schema({
  name: {
    type: String,
    required: [true, 'name is required field !'],
    maxlength: [255, 'name is too long']
  },
  author: {
    type: Schema.Types.ObjectId,
    required: [true, 'author is required field !'],
    ref: 'User'
  },
  lastMessage: {
    type: Schema.Types.ObjectId,
    default: new ObjectId()
  },
  members: {
    type: [Schema.Types.ObjectId]
  },
  deleteAt: {
    type: Date,
    default: null
  }
});

groupSchema.pre('find', function () {
  let query = this.getQuery();
  query.deleteAt = null;
});

groupSchema.pre('findOne', function () {
  let query = this.getQuery();
  query.deleteAt = null;
});

groupSchema.pre('save', async function (next) {
  const user = await User.findOne({ _id: this.author });
  if (!user) {
    return next(new Error('Author is not exist in db'));
  }
});

let Group = mongoose.model('Group', groupSchema);

export default Group;