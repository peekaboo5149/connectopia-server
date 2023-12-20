import { Prop, Schema, SchemaFactory } from '@nestjs/mongoose'
import { Document, Schema as MongooseSchema } from 'mongoose'
import { User } from '../../../../common/auth/user/user.schema'

export type RoomDocument = Room & Document

@Schema({ collection: 'rooms' })
export class Room {
  @Prop({ unique: true, required: true })
  name: string

  @Prop()
  description: string

  @Prop({ type: MongooseSchema.Types.ObjectId, ref: User.name, required: true })
  ownerId: MongooseSchema.Types.ObjectId

  @Prop({ type: [MongooseSchema.Types.ObjectId], ref: User.name })
  members: MongooseSchema.Types.ObjectId[]

  @Prop({ default: false })
  isDeactivated: boolean
}

export const RoomSchema = SchemaFactory.createForClass(Room)
