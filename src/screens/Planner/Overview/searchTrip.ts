import axios from 'axios';
import {Location} from '../../../AppContext';
import {TripPattern} from '../../../sdk';

export default async function searchTrip(
  from: Location,
  to: Location,
): Promise<TripPattern[] | null> {
  const url = 'https://atb-bff.dev.mittatb.no/v1/journey/trip';
  const {coordinates: fromCoordinates} = from;
  const {coordinates: toCoordinates} = to;
  const response = await axios.post<TripPattern[]>(url, {
    from: {
      coordinates: fromCoordinates,
    },
    to: {
      coordinates: toCoordinates,
    },
  });

  return response?.data;
}
