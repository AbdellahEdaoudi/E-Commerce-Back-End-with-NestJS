import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';
import { HydratedDocument } from 'mongoose';

export type UserDocument = HydratedDocument<User>;

@Schema({ timestamps: true })
export class User {

  @Prop({
    type: String,
    required: [true, 'Name is required'],
    minlength: [3, 'Name must be at least 3 characters'],
    maxlength: [30, 'Name must be at most 30 characters'],
  })
  name: string;

  @Prop({
    type: String,
    required: [true, 'Email is required'],
    unique: true,
  })
  email: string;

  @Prop({
    type: String,
    required: [true, 'Password is required'],
    minlength: [3, 'Password must be at least 3 characters'],
    maxlength: [20, 'Password must be at most 20 characters'],
  })
  password: string;

  @Prop({
    type: String,
    required: [true, 'Role is required'],
    enum: ['Admin', 'User'],
  })
  role: string;

  @Prop({
    type: String,
    required: false,
  })
  avatar?: string;

  @Prop({
    type: Number,
    required: false,
  })
  age?: number;

  @Prop({
    type: String,
    required: false,
    match: [/^06[0-9]{8}$/, 'Phone number must be a valid  mobile number'],
  })
  phoneNumber?: string;

  @Prop({
    type: String,
    required: false,
  })
  address?: string;

  @Prop({
    type: Boolean,
    required: true,
  })
  active: boolean;

  @Prop({
    type: String,
    required: [true, 'Verification code is required'],
  })
  verificationCode: string;

  @Prop({
    type: String,
    required: [true, 'Gender is required'],
    enum: ['male', 'female'],
  })
  gender: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
