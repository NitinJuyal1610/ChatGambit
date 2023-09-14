import { useQuery } from '@tanstack/react-query';
import axios from 'axios';
import { Room } from '../../shared/interfaces/chat.interface';

export const useRoomsQuery = () => {
  const query = useQuery({
    queryKey: ['select_rooms'],
    queryFn: (): Promise<Room[]> =>
      axios.get(`/api/rooms`).then((response) => response.data),
  });
  return query;
};
