import axios from 'axios';
import {Location} from '../../../AppContext';
import {TripPattern} from '../../../sdk';

export default async function searchTrip(
  from: Location,
  to: Location,
): Promise<TripPattern[] | null> {
  const {latitude: from_lat, longitude: from_long} = from.coordinates;
  const {latitude: to_lat, longitude: to_long} = to.coordinates;

  const url =
    'https://bff-oneclick-journey-planner-zmj3kfvboa-ew.a.run.app/journey/v1/trips?from=' +
    from_lat +
    ',' +
    from_long +
    '&to=' +
    to_lat +
    ',' +
    to_long;

  const response = await axios.get<TripPattern[]>(url);

  return response?.data;
}
