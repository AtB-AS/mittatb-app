import {lookupVehicleByQr} from '@atb/api/mobility';
import {useQuery} from '@tanstack/react-query';

const ONE_HOUR_MS = 1000 * 60 * 60;

export const useVehicleLookup = (qr: string) =>
  useQuery({
    queryKey: ['vehicleLookup', {qr}],
    queryFn: () => lookupVehicleByQr({qr}),
    staleTime: ONE_HOUR_MS,
    cacheTime: ONE_HOUR_MS,
  });
