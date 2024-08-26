import mongoose from 'mongoose';
import { User } from '../types';
import { v4 as uuidv4 } from 'uuid';

const userSchema = new mongoose.Schema <User> ({
    id: { type: String, default: uuidv4 },
    name: { type: String, required: true },
    address: { type: String, required: true },
    email: { type: String, required: true },
    description: { type: String, required: false }
});

const UserModel = mongoose.model('users', userSchema, 'users');

export default UserModel;