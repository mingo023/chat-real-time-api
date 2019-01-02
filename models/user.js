import mongoose from 'mongoose';
let Schema = mongoose.Schema;

let userSchema = new Schema({
  firstName: String,
  lastName: String,
  phone: Number,
  age: Number,
  email: String,
  password: String,
  isDelete: {
    type: Boolean,
    default: false
  }
});

userSchema.pre('find', function () {
  let query = this.getQuery();
  query.isDelete = false;
});

userSchema.pre('findOne', function () {
  let query = this.getQuery();
  query.isDelete = false;
});

let User = mongoose.model('User', userSchema);

export default User;