import {useEffect, useState} from 'react';
import {ServiceJourneyPolylines} from '@atb/api/types/serviceJourney';
import {getServiceJourneyMapLegs} from '@atb/api/bff/servicejourney';

export function useMapData(
  serviceJourneyId?: string,
  fromQuayId?: string,
  toQuayId?: string,
) {
  const [mapData, setMapData] = useState<ServiceJourneyPolylines>();
  useEffect(() => {
    const getData = async () => {
      if (!serviceJourneyId || !fromQuayId) {
        return;
      }

      try {
        const result = await getServiceJourneyMapLegs(
          serviceJourneyId,
          fromQuayId,
          toQuayId,
        );
        setMapData(result);
      } catch {}
    };

    getData();
  }, [serviceJourneyId, fromQuayId, toQuayId]);
  return mapData;
}
