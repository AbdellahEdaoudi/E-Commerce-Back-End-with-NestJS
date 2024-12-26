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
  })
  password: string;

  @Prop({
    type: String,
    required: [false, 'Role is required'],
    enum: ['admin', 'user'],
    lowercase: true,
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

  @Prop({ type: String })
  address: string;


  @Prop({
    type: Boolean,
    required: false,
  })
  active: boolean;

  @Prop({
    type: String,
    required: [false, 'Verification code is required'],
  })
  verificationCode: string;

  @Prop({
    type: String,
    required: [false, 'Gender is required'],
    enum: ['male', 'female'],
  })
  gender: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
