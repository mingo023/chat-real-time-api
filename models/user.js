import mongoose from 'mongoose';
let Schema = mongoose.Schema;

let userSchema = new Schema({
    firstName: {
      type: String,
      maxlength: [30, 'First name is too long!']
    },
    lastName: {
      type: String,
      maxlength: [30, 'Last name is too long!']
    },
    phone: {
      type: Number,
      trim: [true, 'Not have space in phone field'],
      maxlength: [30, 'Phone is too long!']
    },
    age: {
      type: Number,
      maxlength: [30, 'Age is too long!']
    },
    email: {
      type: String,
      maxlength: [30, 'Email is too long!']
    },
    isDelete: {
      type: Boolean,
      default: false
    }
});

userSchema.pre('find', function() {
  let query = this.getQuery();
  query.isDelete = false;
});

userSchema.pre('findOne', function() {
  let query = this.getQuery();
  query.isDelete = false;
});

let User = mongoose.model('User', userSchema);

export default User;