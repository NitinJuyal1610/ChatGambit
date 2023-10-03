import { Injectable } from '@nestjs/common';
import { Room } from '../entities/room.entity';
import { Room as RoomModel } from '@prisma/client';
import { User } from '../../shared/interfaces/chat.interface';
import { UserService } from '../user/user.service';
import { Room as RoomType } from '../entities/room.entity';
import {
  NotFoundException,
  ConflictException,
  InternalServerErrorException,
} from '@nestjs/common';
import { PrismaService } from '../prisma.service';

@Injectable()
export class RoomService {
  constructor(
    private userService: UserService,
    private prismaService: PrismaService,
  ) {}

  async addRoom(
    roomName: Room['name'],
    hostId: User['userId'],
  ): Promise<RoomModel> {
    const hostUser = await this.userService.getUserById(hostId);
    if (!hostUser) {
      throw new NotFoundException(
        'The host user with which you are attempting to create a new room does not exist',
      );
    }
    const room = await this.prismaService.room.create({
      data: {
        room_name: roomName,
        host: { connect: { user_id: hostId } },
        users: { connect: [{ user_id: hostId }] },
      },
    });

    if (!room) {
      throw new InternalServerErrorException();
    }
    return room;
  }

  async getRoomByName(roomName: Room['name']): Promise<RoomModel> {
    const room = await this.prismaService.room.findUnique({
      where: {
        room_name: roomName,
      },
      include: {
        users: true,
        host: true,
      },
    });

    if (!room) {
      throw new NotFoundException(`Room with name ${roomName} does not exist`);
    }

    return room;
  }

  async addUserToRoom(
    roomName: Room['name'],
    userId: User['userId'],
  ): Promise<void> {
    const newUser = await this.userService.getUserById(userId);

    try {
      const roomDetails = await this.prismaService.room.findUnique({
        where: {
          room_name: roomName,
        },
      });

      if (!roomDetails) {
        await this.addRoom(roomName, newUser.user_id);
      } else {
        await this.prismaService.room.update({
          where: {
            room_name: roomName,
          },
          data: {
            users: {
              connect: { user_id: newUser.user_id },
            },
          },
        });
      }
    } catch (error) {
      throw new InternalServerErrorException();
    }
  }

  async removeUserFromAllRooms(socket_id: User['socketId']): Promise<void> {
    try {
      // Find the user to get their associated rooms (both hosted and joined)
      const user = await this.prismaService.user.findFirst({
        where: { socket_id: socket_id },
      });

      if (!user) {
        throw new NotFoundException(
          `User with socket_id ${socket_id} not found.`,
        );
      }

      const user_id = user.user_id;

      // Disconnect the user from all their rooms (both hosted and joined)
      await this.prismaService.user.update({
        where: { user_id: user_id },
        data: {
          rooms: {
            set: [],
          },
        },
      });

      //assign new host
      await this.transferRoomOwnership(user_id);
      // Finally, delete the user
      await this.prismaService.user.delete({
        where: { user_id: user_id },
      });
    } catch (error) {
      throw new ConflictException(
        'Error removing user from rooms: ' + error.message,
      );
    }
  }

  async transferRoomOwnership(userId: User['userId']): Promise<void> {
    const user = await this.prismaService.user.findUnique({
      where: { user_id: userId },
      include: { hostedRooms: true },
    });

    if (!user) {
      // User doesn't exist
      return;
    }

    for (const room of user.hostedRooms) {
      // Find another user to transfer ownership to
      const newHost = await this.prismaService.user.findFirst({
        where: { id: { not: user.id } }, // Exclude the current user
      });

      if (newHost) {
        // Transfer ownership by updating the room
        await this.prismaService.room.update({
          where: { id: room.id },
          data: {
            host_id: newHost.id,
          },
        });
      } else {
        // No other users to transfer ownership to
        await this.prismaService.room.delete({
          where: { id: room.id },
        });
      }
    }
  }

  async getRooms(): Promise<RoomModel[]> {
    return await this.prismaService.room.findMany();
  }
}
