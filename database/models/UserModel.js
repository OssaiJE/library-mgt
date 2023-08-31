import { Schema, model } from 'mongoose';

// User Model
const userSchema = new Schema({
  fullname: {
    type: String
  },
  email: {
    type: String
  },
  regno: {
    type: String
  },
  usertype: {
    type: String,
    enum: ['student', 'staff', 'librarian'],
    default: 'student'
  },
  password: {
    type: String
  }
},
{ timestamps: true }
);

const User = model('User', userSchema);

export default User;
