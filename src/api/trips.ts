import {TripPattern} from '../sdk';
import {Location} from '../AppContext';
import {getClient} from './client';

export default async function search(from: Location, to: Location) {
  const url = 'v1/journey/trip';
  const {coordinates: fromCoordinates} = from;
  const {coordinates: toCoordinates} = to;
  const client = await getClient();
  const response = await client.post<TripPattern[]>(url, {
    from: {
      coordinates: fromCoordinates,
    },
    to: {
      coordinates: toCoordinates,
    },
  });

  return response;
}
