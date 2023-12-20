import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document } from 'mongoose'

export type UserDocument = User & Document

@Schema({ collection: 'users' })
export class User {
  @Prop({ unique: true, required: true })
  email: string
  @Prop({ unique: true, required: true })
  username: string
  @Prop({ required: true })
  password: string
}

export const UserSchema = SchemaFactory.createForClass(User)
