import mongoose from 'mongoose';
// import { ResponseHandler } from '../helper';
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
  blockedAt: {
    type: Date,
    default: null
  },
  startUpload: {
    type: Date,
    default: new Date()
  },
  countUpload: {
    type: Number,
    default: 0
  },
  codeResetPassword: {
    type: String,
    default: null
  },
  genCodeAt: {
    type: Date,
    default: null
  },
  deletedAt: {
    type: Date,
    default: null
  }
}, { timestamps: { createdAt: 'createdAt' } });

function preFindMiddleware(query) {
  return query.deletedAt = null;
}

userSchema.pre('find', function () {
  preFindMiddleware(this.getQuery());
});

userSchema.pre('findOne', function () {
  preFindMiddleware(this.getQuery());
});

userSchema.pre('findOneAndUpdate', function () {
  preFindMiddleware(this.getQuery());
});

userSchema.post('save', function (error, doc, next) {
  if (error.name === 'MongoError' && error.code === 11000) {
    return next(new Error('this email has been using'));
  }
  return next(error);
});


let User = mongoose.model('User', userSchema);

export default User;