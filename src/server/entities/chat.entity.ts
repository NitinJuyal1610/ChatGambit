import {
  Message as ChatType,
  RoomName,
  User,
} from 'src/shared/interfaces/chat.interface';
import {
  EventNameSchema,
  MessageSchema,
  TimeSentSchema,
} from 'src/shared/schemas/chat.schema';
import { z } from 'zod';

type EventName = z.infer<typeof EventNameSchema>;
type TimeSent = z.infer<typeof TimeSentSchema>;
type Message = z.infer<typeof MessageSchema>;

export class Chat implements ChatType {
  constructor(args: ChatType) {
    Object.assign(args);
  }

  user: User;
  timeSent: TimeSent;
  message: Message;
  roomName: RoomName;
  eventName: EventName;
}
