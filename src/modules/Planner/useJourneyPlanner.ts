import {useState, useEffect} from 'react';
import axios from 'axios';
import {Location} from '../../appContext';
import {TripPattern} from '../../sdk';

export function useJourneyPlanner(from?: Location, to?: Location) {
  const [results, setResults] = useState<TripPattern[] | null>(null);

  useEffect(() => {
    async function searchJournies() {
      if (!from || !to) {
        setResults(null);
      } else {
        const [from_long, from_lat] = from.coordinates;
        const [to_long, to_lat] = to.coordinates;
        const url =
          'https://bff-oneclick-journey-planner-zmj3kfvboa-ew.a.run.app/journey/v1/trips?from=' +
          from_lat +
          ',' +
          from_long +
          '&to=' +
          to_lat +
          ',' +
          to_long;

        const response = await axios.get(url);

        setResults(response?.data);
      }
    }

    searchJournies();
  }, [to, from]);

  return results;
}
