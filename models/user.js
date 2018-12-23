import mongoose from 'mongoose';
let Schema = mongoose.Schema;

let userSchema = new Schema({
    firstName: String,
    lastName: String,
    phone: [String],
    age: Number,
    email: String
});

let User = mongoose.model('User', userSchema);

export default User;