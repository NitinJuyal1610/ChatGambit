import { z } from 'zod';
import type { ChatWithRelations } from './ChatSchema';
import type { ChatOptionalDefaultsWithRelations } from './ChatSchema';
import type { RoomWithRelations } from './RoomSchema';
import type { RoomOptionalDefaultsWithRelations } from './RoomSchema';
import { ChatWithRelationsSchema } from './ChatSchema';
import { ChatOptionalDefaultsWithRelationsSchema } from './ChatSchema';
import { RoomWithRelationsSchema } from './RoomSchema';
import { RoomOptionalDefaultsWithRelationsSchema } from './RoomSchema';
import { UserIdSchema, UserNameSchema, SocketIdSchema } from '../chat.schema';

/////////////////////////////////////////
// USER SCHEMA
/////////////////////////////////////////

export const UserSchema = z.object({
  id: z.number().int(),
  userId: UserIdSchema,
  userName: UserNameSchema,
  socketId: z.string().length(20, { message: 'Must be 20 characters.' }),
});
/////////////////////////////////////////

export const UserOptionalDefaultsSchema = UserSchema.merge(
  z.object({
    id: z.number().int().optional(),
  }),
);

export type UserOptionalDefaults = z.infer<typeof UserOptionalDefaultsSchema>;

/////////////////////////////////////////
// USER RELATION SCHEMA
/////////////////////////////////////////

export type UserRelations = {
  chats: ChatWithRelations[];
  rooms: RoomWithRelations[];
  hostedRooms: RoomWithRelations[];
};

export type UserWithRelations = z.infer<typeof UserSchema> & UserRelations;

export const UserWithRelationsSchema: z.ZodType<UserWithRelations> =
  UserSchema.merge(
    z.object({
      chats: z.lazy(() => ChatWithRelationsSchema).array(),
      rooms: z.lazy(() => RoomWithRelationsSchema).array(),
      hostedRooms: z.lazy(() => RoomWithRelationsSchema).array(),
    }),
  );

/////////////////////////////////////////
// USER OPTIONAL DEFAULTS RELATION SCHEMA
/////////////////////////////////////////

export type UserOptionalDefaultsRelations = {
  chats: ChatOptionalDefaultsWithRelations[];
  rooms: RoomOptionalDefaultsWithRelations[];
  hostedRooms: RoomOptionalDefaultsWithRelations[];
};

export type UserOptionalDefaultsWithRelations = z.infer<
  typeof UserOptionalDefaultsSchema
> &
  UserOptionalDefaultsRelations;

export const UserOptionalDefaultsWithRelationsSchema: z.ZodType<UserOptionalDefaultsWithRelations> =
  UserOptionalDefaultsSchema.merge(
    z.object({
      chats: z.lazy(() => ChatOptionalDefaultsWithRelationsSchema).array(),
      rooms: z.lazy(() => RoomOptionalDefaultsWithRelationsSchema).array(),
      hostedRooms: z
        .lazy(() => RoomOptionalDefaultsWithRelationsSchema)
        .array(),
    }),
  );

export default UserSchema;
