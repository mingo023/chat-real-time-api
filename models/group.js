import mongoose from 'mongoose';
import User from './user';


let Schema = mongoose.Schema;
let ObjectId = mongoose.Types.ObjectId;

let groupSchema = new Schema({
  name: {
    type: String,
  },
  author: {
    type: Schema.Types.ObjectId,
    ref: 'User'
  },
  lastMessage: {
    type: Schema.Types.ObjectId,
    default: new ObjectId()
  },
  members: [{type: Schema.Types.ObjectId, ref: 'User'}],
  deletedAt: {
    type: Date,
    default: null
  }
});

function checkFindUser() {
  let query = this.getQuery();
  return query.deletedAt = null;
};

groupSchema.pre('find', function () {
  checkFindUser.apply(this);  
});

groupSchema.pre('findOne', function () {
  checkFindUser.apply(this);
});

groupSchema.pre('save', async function (next) {

  const user = await User.findOne({ _id: this.author });
  if (!user) {
    return next(new Error('Author is not exist in db'));
  }
  
  const members = await User.find({ _id: this.members });
  if (members.length !== this.members.length) {
    return next(new Error('Member is not exist in db'));
  }
  
});

let Group = mongoose.model('Group', groupSchema);

export default Group;