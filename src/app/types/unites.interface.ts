import { Location } from '../types/location.interface';

export interface Unites {
  current_country_id: number;
  locations: Location[];
  total: number;
  wp_total: number;
  success: boolean;
}
