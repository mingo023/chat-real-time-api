import mongoose from 'mongoose';
let Schema = mongoose.Schema;
let ObjectIdSchema = Schema.ObjectId;
let ObjectId = mongoose.Types.ObjectId;

let groupSchema = new Schema({
  name: String,
  author: {
    type: ObjectIdSchema
  },
  lastMessage: {
    type: ObjectIdSchema,
    default: new ObjectId()
  },
  members: [String],
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


let Group = mongoose.model('Group', groupSchema);

export default Group;