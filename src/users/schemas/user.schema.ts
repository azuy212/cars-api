import { User as IUser } from '@/interfaces/user';
import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose';

@Schema()
export class User implements IUser {
  @Prop(String)
  username: string;

  @Prop(String)
  password: string;
}

export const UserSchema = SchemaFactory.createForClass(User);
