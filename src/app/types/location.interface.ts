import { Schedule } from '../types/schedules.interface';

export interface Location {
  id: number;
  title: string;
  content: string;
  opened: boolean;
  mask: string;
  towel: string;
  fountain: string;
  locker_room: string;
  schedules: Schedule[];
}
