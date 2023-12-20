import { Module } from '@nestjs/common'
import { MongooseModule } from '@nestjs/mongoose'
import { Room, RoomSchema } from './models/room.schema'
import { RoomController } from './room.controller'
import { RoomRepository } from './room.repository'
import { RoomService } from './room.service'

@Module({
  imports: [
    MongooseModule.forFeature([{ name: Room.name, schema: RoomSchema }]),
  ],
  controllers: [RoomController],
  providers: [RoomService, RoomRepository],
  exports: [RoomRepository],
})
export class RoomModule {}
