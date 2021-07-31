import { Request } from 'express';
import { Document } from 'mongoose';

export interface User {
  _id?: string;
  username: string;
  password: string;
}

export interface UserDocument extends User, Document<string> {}

export type UserWithoutPassword = Omit<User, 'password'>;

export type JwtUserPayload = {
  sub: string;
  username: string;
};

export interface UserRequest extends Request {
  user: UserWithoutPassword;
}
