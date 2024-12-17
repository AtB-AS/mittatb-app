import {useQuery} from '@tanstack/react-query';
import {getMapboxStyle} from '@atb/api/mapbox';
import {ONE_DAY_MS} from '@atb/utils/durations.ts';

export const useMapboxStyle = (styleUrl: string) => {
  return useQuery({
    queryKey: [styleUrl],
    queryFn: ({}) => getMapboxStyle(styleUrl),
    staleTime: ONE_DAY_MS, // consider 1 week?
    cacheTime: ONE_DAY_MS, // consider 1 week?
  });
};
