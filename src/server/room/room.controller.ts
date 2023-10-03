import { Controller, Get, NotFoundException, Param } from '@nestjs/common';
import { Room } from '../entities/room.entity';
import { RoomService } from './room.service';
import { Room as RoomModel } from '@prisma/client';
import { Body, Post } from '@nestjs/common/decorators';
import { User } from '../entities/user.entity';

@Controller()
export class RoomController {
  constructor(private roomService: RoomService) {}

  @Get('api/rooms')
  async getAllRooms(): Promise<RoomModel[]> {
    return await this.roomService.getRooms();
  }

  // @Get('api/rooms/:room')
  // async getRoom(@Param() params): Promise<Room> {
  //   const room = await this.roomService.getRoomByName(params.room);
  //   if (room === 'Not Exists') {
  //     throw new NotFoundException();
  //   }
  //   return room;
  // }

  // @Post('api/rooms')
  // async addRoom(
  //   @Body() body: { roomName: Room['name']; hostId: User['userId'] },
  // ): Promise<RoomModel> {
  //   return await this.roomService.addRoom(body.roomName, body.hostId);
  // }

  @Post('api/rooms')
  async modifyUser(userId: User['userId']): Promise<void> {
    return await this.roomService.removeUserFromAllRooms(userId);
  }
}
