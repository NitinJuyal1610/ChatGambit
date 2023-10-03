import { z } from 'zod';
import { UserIdSchema, UserNameSchema } from '../chat.schema';

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

export default UserSchema;
