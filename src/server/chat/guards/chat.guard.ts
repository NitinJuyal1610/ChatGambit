import {
  CanActivate,
  ExecutionContext,
  ForbiddenException,
  Injectable,
} from '@nestjs/common';
import {
  Action,
  AppAbility,
  CaslAbilityFactory,
} from '../../casl/casl-ability.factory';
import { RoomService } from '../../room/room.service';
import { PolicyHandler } from '../../casl/interfaces/policy.interface';
import {
  ClientToServerEvents,
  Room as RoomType,
  SocketId,
  User,
  UserName,
} from '../../../shared/interfaces/chat.interface';

import { ConflictException } from '@nestjs/common/exceptions/conflict.exception';
import { UserService } from 'src/server/user/user.service';

@Injectable()
export class ChatPoliciesGuard<
  CtxData extends {
    userId: string;
    roomName: RoomType['name'];
    eventName: keyof ClientToServerEvents;
  },
> implements CanActivate
{
  constructor(
    private caslAbilityFactory: CaslAbilityFactory,
    private roomService: RoomService,
    private userService: UserService,
  ) {}

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const policyHandlers: PolicyHandler[] = [];
    const ctx = context.switchToWs();
    const data = ctx.getData<CtxData>();

    const user = await this.userService.getUserById(data.userId);
    const room = await this.roomService.getRoomByName(data.roomName);

    // if (data.eventName === 'kick_user') {
    //   if (!room) {
    //     throw new ConflictException(
    //       `Room must exist to evaluate ${data.eventName} policy`,
    //     );
    //   }
    //   policyHandlers.push((ability) => ability.can(Action.Kick, room));
    // }

    // if (data.eventName === 'join_room') {
    //   policyHandlers.push((ability) => ability.can(Action.Join, room));
    // }

    // if (data.eventName === 'chat') {
    //   if (!room) {
    //     throw new ConflictException(
    //       `Room must exist to evaluate ${data.eventName} policy`,
    //     );
    //   }
    //   policyHandlers.push((ability) => ability.can(Action.Message, room));
    // }

    const ability = this.caslAbilityFactory.createForUser(user);
    policyHandlers.every((handler) => {
      const check = this.execPolicyHandler(handler, ability);

      console.log(check, ability);
      if (check === false) {
        throw new ForbiddenException();
      }
    });
    return true;
  }

  private execPolicyHandler(handler: PolicyHandler, ability: AppAbility) {
    if (typeof handler === 'function') {
      return handler(ability);
    }
    return handler.handle(ability);
  }
}
