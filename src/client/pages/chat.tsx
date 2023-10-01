import React, { useState, useEffect } from 'react';
import { MakeGenerics, useMatch, useNavigate } from '@tanstack/react-location';
import { io, Socket } from 'socket.io-client';
import {
  User,
  Message,
  ServerToClientEvents,
  ClientToServerEvents,
  KickUser,
  JoinRoom,
} from '../../shared/interfaces/chat.interface';
import { Header } from '../components/header';
import { UserList } from '../components/list';
import { MessageForm } from '../components/message.form';
import { Messages, ClientMessage } from '../components/messages';
import { ChatLayout } from '../layouts/chat.layout';
import { unsetRoom, useRoomQuery } from '../lib/room';
import { getUser } from '../lib/user';
import { LoadingLayout } from '../layouts/loading.layout';
import { Loading } from '../components/loading';
import {
  ChatMessageSchema,
  JoinRoomSchema,
  KickUserSchema,
} from '../../shared/schemas/chat.schema';

const socket: Socket<ServerToClientEvents, ClientToServerEvents> = io({
  autoConnect: false,
});

function Chat() {
  const {
    data: { user, roomName },
  } = useMatch<ChatLocationGenerics>();

  const [isConnected, setIsConnected] = useState(socket.connected);
  const [messages, setMessages] = useState<ClientMessage[]>([]);
  const [toggleUserList, setToggleUserList] = useState<boolean>(false);
  const [isJoinedRoom, setIsJoinedRoom] = useState(false);
  const [isJoiningDelay, setIsJoiningDelay] = useState(false);
  const { data: room, refetch: roomRefetch } = useRoomQuery(
    roomName,
    isConnected,
  );

  const navigate = useNavigate();

  useEffect(() => {
    if (!user || !roomName) {
      navigate({ to: '/', replace: true });
    } else {
      socket.on('connect', () => {
        setIsJoiningDelay(true);
        const joinRoom: JoinRoom = {
          roomName,
          user: { socketId: socket.id, ...user },
          eventName: 'join_room',
        };

        try {
          JoinRoomSchema.parse(joinRoom);
        } catch (error) {
          console.log(error);
          leaveRoom();
          return;
        }
        setTimeout(() => {
          // default required 800 ms minimum join delay to prevent flickering
          setIsJoiningDelay(false);
        }, 800);
        socket.timeout(30000).emit('join_room', joinRoom, (err, response) => {
          if (err) {
            leaveRoom();
          }
          if (response) {
            setIsJoinedRoom(true);
          }
        });
        setIsConnected(true);
      });

      socket.on('disconnect', () => {
        setIsConnected(false);
      });

      socket.on('chat', (e) => {
        if (e.user.userId !== user.userId) {
          setMessages((messages) => [{ ...e, delivered: true }, ...messages]);
        }
      });

      socket.on('kick_user', (e) => {
        if (e.userToKick.socketId === socket.id) {
          leaveRoom();
        }
      });

      socket.connect();
    }
    return () => {
      socket.off('connect');
      socket.off('disconnect');
      socket.off('chat');
      socket.off('kick_user');
    };
  }, []);

  const leaveRoom = () => {
    socket.disconnect();
    unsetRoom();
    navigate({ to: '/', replace: true });
  };

  const sendMessage = (message: string) => {
    if (user && socket && roomName) {
      const chatMessage: Message = {
        user: {
          userId: user.userId,
          userName: user.userName,
          socketId: socket.id,
        },
        timeSent: Date.now(),
        message,
        roomName: roomName,
        eventName: 'chat',
      };
      // Check if chat message passes schema check

      try {
        ChatMessageSchema.parse(chatMessage);
      } catch (error) {
        console.log(error);
        return;
      }

      // Update state with message "delivered" status to false
      setMessages((messages) => [
        { ...chatMessage, delivered: false },
        ...messages,
      ]);
      // Emit 'chat' event with message and callback
      socket.emit('chat', chatMessage, (response) => {
        // If server response with response === true
        if (response) {
          // Update state by finding previously set message
          // and setting it's "delivered" status to true
          setMessages((messages) => {
            const previousMessageIndex = messages.findIndex((mes) => {
              if (
                mes.user.userId === user.userId &&
                mes.timeSent === chatMessage.timeSent
              ) {
                return mes;
              }
            });
            if (previousMessageIndex === -1) {
              throw 'Previously sent message not found to update delivered status';
            }
            messages[previousMessageIndex] = {
              ...messages[previousMessageIndex],
              delivered: true,
            };
            return [...messages];
          });
        }
      });
    }
  };

  const kickUser = (userToKick: User) => {
    if (!room) {
      throw 'No room';
    }
    if (!user) {
      throw 'No current user';
    }
    const kickUserData: KickUser = {
      user: { ...user, socketId: socket.id },
      userToKick: userToKick,
      roomName: room.name,
      eventName: 'kick_user',
    };

    try {
      KickUserSchema.parse(kickUserData);
    } catch (error) {
      console.error(error);
      return;
    }

    socket.emit('kick_user', kickUserData, (complete) => {
      if (complete) {
        roomRefetch();
      }
    });
  };

  return (
    <>
      {user?.userId && roomName && room && isJoinedRoom && !isJoiningDelay ? (
        <ChatLayout>
          <Header
            isConnected={isConnected}
            users={room?.users ?? []}
            roomName={roomName}
            handleUsersClick={() =>
              setToggleUserList((toggleUserList) => !toggleUserList)
            }
            handleLeaveRoom={() => leaveRoom()}
          ></Header>
          {toggleUserList ? (
            <UserList
              room={room}
              currentUser={{ socketId: socket.id, ...user }}
              kickHandler={kickUser}
            ></UserList>
          ) : (
            <Messages user={user} messages={messages}></Messages>
          )}
          <MessageForm sendMessage={sendMessage}></MessageForm>
        </ChatLayout>
      ) : (
        <LoadingLayout>
          <Loading message={`Joining ${roomName}`}></Loading>
        </LoadingLayout>
      )}
    </>
  );
}

export const loader = async () => {
  const user = getUser();
  return {
    user: user,
    roomName: sessionStorage.getItem('room'),
  };
};

type ChatLocationGenerics = MakeGenerics<{
  LoaderData: {
    user: Pick<User, 'userId' | 'userName'>;
    roomName: string;
  };
}>;

export default Chat;
