import {
  Body,
  Controller,
  Delete,
  Get,
  HttpException,
  HttpStatus,
  Param,
  Patch,
  Post,
  Query,
  Request,
} from '@nestjs/common'
import { Payload } from '../../../common/auth/models/types'
import { CreateRoomDto } from './dto/create-room.dto'
import { MembersDto } from './dto/members.dto'
import { UpdateRoomDto } from './dto/update-room.dto'
import { RoomService } from './room.service'

@Controller('room')
export class RoomController {
  constructor(private readonly roomService: RoomService) {}

  // Basic room related routes
  @Get()
  public async findAllRoom() {
    return this.roomService.findAllRoom()
  }

  @Post()
  public async createRoom(
    @Body() requestBody: CreateRoomDto,
    @Request() req: any,
  ) {
    // get the id of user in from the authorization header
    const payload = req['user'] as Payload
    return this.roomService.createRoom(requestBody, payload.sub)
  }

  @Get('/:roomId')
  public async findOneRoom(@Param('roomId') roomId: string) {
    return this.roomService.findOneRoom(roomId)
  }

  @Patch('/:roomId')
  public async updateRoom(
    @Param('roomId') roomId: string,
    @Body() requestBody: UpdateRoomDto,
    @Request() req: any,
  ) {
    const payload = req['user'] as Payload
    return await this.roomService.updateRoom(requestBody, roomId, payload.sub)
  }

  @Delete('/:roomId')
  public async deleteRoom(
    @Param('roomId') roomId: string,
    @Request() req: any,
  ) {
    const payload = req['user'] as Payload
    return await this.roomService.deleteRoom(roomId, payload.sub)
  }

  @Patch('/:roomId/member')
  public async addOrRemoveUsers(
    @Body() requestBody: MembersDto,
    @Param('roomId') roomId: string,
    @Query() opertionType: { opertionType: 'add' | 'remove' },
    @Request() req: any,
  ) {
    const userId = (req['user'] as Payload).sub

    switch (opertionType.opertionType) {
      case 'add':
        return await this.roomService.addUsers(
          roomId,
          requestBody.members,
          userId,
        )
      case 'remove':
        return await this.roomService.removeUsers(
          roomId,
          requestBody.members,
          userId,
        )
      default:
        throw new HttpException(
          'Invalid Operation Type',
          HttpStatus.BAD_REQUEST,
        )
    }
  }

  // User room intraction --> a user can exit a room
  @Get('/:roomId/member/leave')
  public async exitRoom(@Param('roomId') roomId: string, @Request() req: any) {
    const userId = (req['user'] as Payload).sub
    return await this.roomService.exitRoom(roomId, userId)
  }
}
