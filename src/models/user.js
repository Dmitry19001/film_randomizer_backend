import { Schema, model } from 'mongoose';

const userSchema = new Schema({
    username: {
        type: String,
        required: [true, 'Please add a username'],
    },
    password: {
        type: String,
        required: [true, 'Please add a password'],
    },
  
});

export default model('User', userSchema);
