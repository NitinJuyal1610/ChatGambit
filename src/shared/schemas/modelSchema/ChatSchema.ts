import { z } from 'zod';

import type { UserWithRelations } from './UserSchema';
import type { UserOptionalDefaultsWithRelations } from './UserSchema';
import type { RoomWithRelations } from './RoomSchema';
import type { RoomOptionalDefaultsWithRelations } from './RoomSchema';
import { UserWithRelationsSchema } from './UserSchema';
import { UserOptionalDefaultsWithRelationsSchema } from './UserSchema';
import { RoomWithRelationsSchema } from './RoomSchema';
import { RoomOptionalDefaultsWithRelationsSchema } from './RoomSchema';

import { EventNameSchema } from '../chat.schema';
import {
  UserIdSchema,
  TimeSentSchema,
  MessageSchema,
  RoomNameSchema,
} from '../chat.schema';

/////////////////////////////////////////
// CHAT SCHEMA
/////////////////////////////////////////

export const ChatSchema = z.object({
  eventName: EventNameSchema,
  id: z.number().int(),
  userId: UserIdSchema,
  timeSent: TimeSentSchema,
  message: MessageSchema,
  roomName: RoomNameSchema,
});

export type Chat = z.infer<typeof ChatSchema>;

/////////////////////////////////////////
// CHAT OPTIONAL DEFAULTS SCHEMA
/////////////////////////////////////////

export const ChatOptionalDefaultsSchema = ChatSchema.merge(
  z.object({
    id: z.number().int().optional(),
  }),
);

export type ChatOptionalDefaults = z.infer<typeof ChatOptionalDefaultsSchema>;

/////////////////////////////////////////
// CHAT RELATION SCHEMA
/////////////////////////////////////////

export type ChatRelations = {
  user?: UserWithRelations | null;
  room?: RoomWithRelations | null;
};

export type ChatWithRelations = z.infer<typeof ChatSchema> & ChatRelations;

const x= { 
  user: { 
    userId: string; 
    userName: string; 
    socketId: string; 
    id?: number | undefined; 
  }; 
  roomName: string; 
  eventName: "chat" | "kick_user" | "join_room"; 
 }

export const ChatWithRelationsSchema: z.ZodType<ChatWithRelations> =
  ChatSchema.merge(
    z.object({
      user: z.lazy(() => UserWithRelationsSchema).nullable(),
      room: z.lazy(() => RoomWithRelationsSchema).nullable(),
    }),
  );

/////////////////////////////////////////
// CHAT OPTIONAL DEFAULTS RELATION SCHEMA
/////////////////////////////////////////

export type ChatOptionalDefaultsRelations = {
  user?: UserOptionalDefaultsWithRelations | null;
  room?: RoomOptionalDefaultsWithRelations | null;
};

export type ChatOptionalDefaultsWithRelations = z.infer<
  typeof ChatOptionalDefaultsSchema
> &
  ChatOptionalDefaultsRelations;

export const ChatOptionalDefaultsWithRelationsSchema: z.ZodType<ChatOptionalDefaultsWithRelations> =
  ChatOptionalDefaultsSchema.merge(
    z.object({
      user: z.lazy(() => UserOptionalDefaultsWithRelationsSchema).nullable(),
      room: z.lazy(() => RoomOptionalDefaultsWithRelationsSchema).nullable(),
    }),
  );

export default ChatSchema;
