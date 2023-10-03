import { z } from 'zod';
import {
  JoinRoomSchema,
  KickUserSchema,
  RoomNameSchema,
  RoomSchema,
  SocketIdSchema,
  UserIdSchema,
  UserNameSchema,
  ServerToClientEventsSchema,
  ClientToServerEventsSchema,
  UserSchema,
  ChatMessageSchema,
} from '../schemas/chat.schema';

export type UserId = z.infer<typeof UserIdSchema>;
export type UserName = z.infer<typeof UserNameSchema>;
export type SocketId = z.infer<typeof SocketIdSchema>;
export type User = z.infer<typeof UserSchema>;
export type RoomName = z.infer<typeof RoomNameSchema>;
export type Room = z.infer<typeof RoomSchema>;
export type Message = z.infer<typeof ChatMessageSchema>;

export type JoinRoom = z.infer<typeof JoinRoomSchema>;
export type KickUser = z.infer<typeof KickUserSchema>;

export type ServerToClientEvents = z.infer<typeof ServerToClientEventsSchema>;
export type ClientToServerEvents = z.infer<typeof ClientToServerEventsSchema>;
