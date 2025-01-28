import mongoose, { Schema, Document } from 'mongoose';

export interface Message extends Document {
  content: string;
  createdAt: Date;
}

const MessageSchema: Schema<Message> = new Schema({
  content: {
    type: String,
    required: true,
  },
  createdAt: {
    type: Date,
    default: Date.now,
  },
});

export interface User extends Document {
  username: string;
  email: string;
  password: string;
  isAcceptingMessage: boolean;
  verifyCode: string;
  verifyCodeExpiry: Date;
  isVerified: boolean;
  messages: [Message];
}

const UserSchema: Schema<User> = new Schema({
  username: {
    type: String,
    required: [true, 'User name is required'],
    unique: [true, 'User name should be unique'],
  },
  email: {
    type: String,
    required: [true, 'Email is required'],
    unique: [true, 'Email should be unique'],
  },
  password: {
    type: String,
    required: [true, 'Password is required'],
  },
  isAcceptingMessage: {
    type: Boolean,
    default: true,
  },
  isVerified: {
    type: Boolean,
    default: false,
  },
  verifyCode: {
    type: String,
  },
  verifyCodeExpiry: {
    type: Date,
  },
  messages: [MessageSchema],
});

const UserModel =
  (mongoose.models.User as mongoose.Model<User>) ||
  mongoose.model<User>('User', UserSchema);

export default UserModel;
