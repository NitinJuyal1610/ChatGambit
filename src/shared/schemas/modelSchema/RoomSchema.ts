import { z } from 'zod';

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

export default RoomSchema;
