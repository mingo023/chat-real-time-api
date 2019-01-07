import mongoose from 'mongoose';
let Schema = mongoose.Schema;

let userSchema = new Schema({
  gender: Boolean,
  fullName: {
    first: {
      type: String,
      maxlength: [30, 'First name is too long!']
    },
    last: {
      type: String,
      maxlength: [30, 'Last name is too long!']
    }
  },
  email: {
    type: String,
    required: [true, 'Email is required field'],
    maxlength: [30, 'Email is too long!'],
    unique: true
  },
  password: {
    type: String,
    required: [true, "Password is required field"],
    maxlength: [255, 'Password is too long!']
  },
  deletedAt: Date
});

// userSchema.pre('find', function(next) {

// }); 

userSchema.post('save', function (error, doc, next) {
  if (error.name === 'MongoError' && error.code === 11000) {
    return next(new Error('this email has been using'));
  }
  return next(error);
});


let User = mongoose.model('User', userSchema);

export default User;