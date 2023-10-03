import { z } from 'zod';
import type { UserWithRelations } from './UserSchema';
import type { UserOptionalDefaultsWithRelations } from './UserSchema';
import type { ChatWithRelations } from './ChatSchema';
import type { ChatOptionalDefaultsWithRelations } from './ChatSchema';
import { UserWithRelationsSchema } from './UserSchema';
import { UserOptionalDefaultsWithRelationsSchema } from './UserSchema';
import { ChatWithRelationsSchema } from './ChatSchema';
import { ChatOptionalDefaultsWithRelationsSchema } from './ChatSchema';
import { RoomNameSchema } from '../chat.schema';

/////////////////////////////////////////
// ROOM SCHEMA
/////////////////////////////////////////

export const RoomSchema = z.object({
  id: z.number().int(),
  roomName: RoomNameSchema,
  hostId: z.number().int().nullable(),
});
export type Room = z.infer<typeof RoomSchema>;

/////////////////////////////////////////
// ROOM OPTIONAL DEFAULTS SCHEMA
/////////////////////////////////////////

export const RoomOptionalDefaultsSchema = RoomSchema.merge(
  z.object({
    id: z.number().int().optional(),
  }),
);

export type RoomOptionalDefaults = z.infer<typeof RoomOptionalDefaultsSchema>;

/////////////////////////////////////////
// ROOM RELATION SCHEMA
/////////////////////////////////////////

export type RoomRelations = {
  host?: UserWithRelations | null;
  chats: ChatWithRelations[];
  users: UserWithRelations[];
};

export type RoomWithRelations = z.infer<typeof RoomSchema> & RoomRelations;

export const RoomWithRelationsSchema: z.ZodType<RoomWithRelations> =
  RoomSchema.merge(
    z.object({
      host: z.lazy(() => UserWithRelationsSchema).nullable(),
      chats: z.lazy(() => ChatWithRelationsSchema).array(),
      users: z.lazy(() => UserWithRelationsSchema).array(),
    }),
  );

/////////////////////////////////////////
// ROOM OPTIONAL DEFAULTS RELATION SCHEMA
/////////////////////////////////////////

export type RoomOptionalDefaultsRelations = {
  host?: UserOptionalDefaultsWithRelations | null;
  chats: ChatOptionalDefaultsWithRelations[];
  users: UserOptionalDefaultsWithRelations[];
};

export type RoomOptionalDefaultsWithRelations = z.infer<
  typeof RoomOptionalDefaultsSchema
> &
  RoomOptionalDefaultsRelations;

export const RoomOptionalDefaultsWithRelationsSchema: z.ZodType<RoomOptionalDefaultsWithRelations> =
  RoomOptionalDefaultsSchema.merge(
    z.object({
      host: z.lazy(() => UserOptionalDefaultsWithRelationsSchema).nullable(),
      chats: z.lazy(() => ChatOptionalDefaultsWithRelationsSchema).array(),
      users: z.lazy(() => UserOptionalDefaultsWithRelationsSchema).array(),
    }),
  );

export default RoomSchema;
