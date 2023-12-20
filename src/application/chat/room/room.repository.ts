import { Injectable } from '@nestjs/common'
import { InjectModel } from '@nestjs/mongoose'
import { Model } from 'mongoose'
import { EntityRepository } from '../../../shared/database/entity.repository'
import { Room, RoomDocument } from './models/room.schema'

@Injectable()
export class RoomRepository extends EntityRepository<RoomDocument> {
  constructor(
    @InjectModel(Room.name) private readonly roomModel: Model<RoomDocument>,
  ) {
    super(roomModel)
  }
}
