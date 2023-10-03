import { z } from 'zod';

import { EventNameSchema } from '../chat.schema';
import {
  UserIdSchema,
  TimeSentSchema,
  MessageSchema,
  RoomNameSchema,
} from '../chat.schema';
import UserSchema from './UserSchema';

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
  user: UserSchema,
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

export default ChatSchema;
