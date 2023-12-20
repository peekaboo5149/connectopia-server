import {
  ConflictException,
  ForbiddenException,
  HttpException,
  HttpStatus,
  Injectable,
  Logger,
  NotFoundException,
  UnauthorizedException,
} from '@nestjs/common'
import { CreateRoomDto } from './dto/create-room.dto'
import { UpdateRoomDto } from './dto/update-room.dto'
import { RoomRepository } from './room.repository'

@Injectable()
export class RoomService {
  private readonly logger = new Logger(RoomRepository.name, { timestamp: true })
  constructor(private readonly roomRepository: RoomRepository) {}

  public async findAllRoom() {
    //get all active rooms
    return await this.roomRepository.find({ isDeactivated: false })
  }

  public async createRoom(roomParams: CreateRoomDto, ownerId: string) {
    const newRoom = { ownerId, ...roomParams }

    //Check room with same name exist
    const existingRoom = await this.roomRepository.findOne({
      name: newRoom.name,
    })
    // Do not add owner as a regular member
    if (newRoom.members) {
      newRoom.members = newRoom.members.filter((id) => id !== ownerId)
    }

    if (existingRoom) throw new ConflictException('Room name already taken')
    return await this.roomRepository.create(newRoom)
  }

  public async findOneRoom(roomId: string) {
    return await this.roomRepository.findOne({ _id: roomId })
  }

  public async updateRoom(
    params: UpdateRoomDto,
    roomId: string,
    userId: string,
  ) {
    const room = await this.findRoomOrThrow(roomId)
    if (params.opertionType) {
      return this.deActivateorActivateRoom(roomId, userId, params.opertionType)
    } else {
      const isMemberOrOwner =
        room.members.find((id) => id.toString() === userId) ||
        room.ownerId.toString() === userId

      if (!isMemberOrOwner) {
        throw new UnauthorizedException(
          'Only a owner/member of this room can update',
        )
      }

      const updateDoc: Omit<UpdateRoomDto, 'opertionType'> = {
        name: params.name,
        description: params.description,
      }
      return await this.roomRepository.findOneAndUpdate(
        { _id: roomId },
        updateDoc,
      )
    }
  }

  private async deActivateorActivateRoom(
    roomId: string,
    userId: string,
    opertionType: 'activate' | 'deactivate',
  ) {
    const room = await this.findRoomOrThrow(roomId)
    if (room.ownerId.toString() !== userId)
      throw new UnauthorizedException(
        'Only the owner can activate/deactivate this room',
      )

    const currActiveCondition = !room.isDeactivated

    const commandedActiveCondition = opertionType === 'activate'

    // Case 1: Activate a deactive room
    if (!currActiveCondition && commandedActiveCondition) {
      await this.roomRepository.findOneAndUpdate(
        { _id: roomId },
        { isDeactivated: false },
      )
    }

    // Case 2: DeActivate a active room
    else if (!commandedActiveCondition && currActiveCondition) {
      await this.roomRepository.findOneAndUpdate(
        { _id: roomId },
        { isDeactivated: true },
      )
    }

    // Case 3: Activate a already active room
    // Case 4: DeActivate a already deactive room
    else {
      throw new ConflictException('Already ' + opertionType)
    }

    return {
      message: 'Success',
      roomId: roomId,
    }
  }

  public async deleteRoom(roomId: string, userID: string) {
    // find the room
    const room = await this.findRoomOrThrow(roomId)
    const isOwner = room.ownerId.toString() === userID

    this.logger.log(
      `Room[${roomId}] deleted by userId[${userID}], isOwner -> ${isOwner}`,
    )

    if (!isOwner)
      throw new UnauthorizedException(
        'Only the owner of this room has the permission to delete this room',
      )

    const deleted = await this.roomRepository.deleteMany({
      _id: roomId,
    })

    if (deleted)
      return {
        message: 'Successfully deleted Room',
      }
    else
      throw new HttpException(
        'Could not delete room(s)',
        HttpStatus.INTERNAL_SERVER_ERROR,
      )
  }

  // User room intraction --> this can add many user, this will be done by the room owner
  public async addUsers(roomId: string, users: string[], userId: string) {
    const room = await this.findRoomOrThrow(roomId)
    const existingMember: string[] = room.members.map((id) => id.toString())

    if (
      !existingMember.includes(userId) &&
      room.ownerId.toString() !== userId
    ) {
      throw new UnauthorizedException(
        'Only a member of this room can add new user(s)',
      )
    }

    if (room.isDeactivated) {
      throw new ForbiddenException('Cannot add user(s) in a deactivated room')
    }

    const newUser = [] as string[]

    for (const user of users) {
      if (
        !existingMember.includes(user) &&
        room.ownerId.toString() !== userId
      ) {
        newUser.push(user)
      }
    }

    if (newUser.length === 0) {
      throw new HttpException(
        'All Users are already a member of this room',
        HttpStatus.BAD_REQUEST,
      )
    }

    await this.roomRepository.findOneAndUpdate(
      { _id: roomId },
      { $push: { members: { $each: newUser } } },
    )

    return {
      message: 'Successfully added users',
      newUsers: newUser,
      addedBy: userId,
    }
  }

  // User room intraction --> this can add many user, this will be done by the room owner
  public async removeUsers(roomId: string, users: string[], userId: string) {
    const room = await this.findRoomOrThrow(roomId)
    const ownerId = room.ownerId.toString()

    const existingUser = room.members.map((id) => id.toString())

    if (ownerId !== userId && !existingUser.includes(userId)) {
      throw new UnauthorizedException(
        'Only a member of this room can add new user(s)',
      )
    }

    if (room.isDeactivated) {
      throw new ForbiddenException('User is not a member of this room')
    }

    const newUser = [] as string[] // users to remove
    for (const user of users) {
      if (existingUser.includes(user) && ownerId !== user) {
        newUser.push(user)
      }
    }

    if (newUser.length === 0) {
      throw new HttpException(
        'All Users are already a member of this room',
        HttpStatus.BAD_REQUEST,
      )
    }

    await this.roomRepository.findOneAndUpdate(
      { _id: roomId },
      { $pull: { members: { $each: newUser } } },
    )

    return {
      message: 'Successfully removed users',
      newUsers: newUser,
      removedBy: userId,
    }
  }

  // User room intraction --> a user can exit a room
  public async exitRoom(roomId: string, userId: string) {
    const room = await this.findRoomOrThrow(roomId)
    const isOwner = room.ownerId.toString() === userId
    const isMember = room.members.find((id) => id.toString() === userId)
    if (!isMember && !isOwner)
      throw new UnauthorizedException('User is not a member/owner of this room')

    if (isOwner) {
      // If the owner is leaving this room
      // check if the room has any member
      const size = room.members.length
      if (size > 0) {
        const newOwnerId = room.members[0]

        // fetch the latest user and assign it to be the owner and remove the newOwner from members
        this.logger.debug(
          `Trying to assign a new owner (${newOwnerId.toString()}) for room =${
            room.name
          }[${room._id}]`,
        )
        await this.roomRepository.findOneAndUpdate(
          { _id: roomId },
          { ownerId: newOwnerId, $pull: { members: newOwnerId } },
        )

        return {
          message: `Successfully exited room ` + room.name,
          newOwner: newOwnerId,
        }
      } else {
        // deactivate the group
        await this.roomRepository.findOneAndUpdate(
          { _id: roomId },
          { isDeactivated: true },
        )
        throw new ForbiddenException(
          'Cannot leave a room with zero members. Room has been deactivated. Please explicitly delete this room if needed',
        )
      }
    } else if (isMember) {
      // If a member is leaving this room
      await this.roomRepository.findOneAndUpdate(
        { _id: roomId },
        { $pull: { members: userId } },
      )
      return {
        message: `Successfully exited room ` + room.name,
      }
    }
  }

  private async findRoomOrThrow(roomId: string) {
    const room = await this.roomRepository.findOne({ _id: roomId })
    if (!room) throw new NotFoundException('Room not found')
    return room
  }
}
