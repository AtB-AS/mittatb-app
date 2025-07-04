import {useQuery} from '@tanstack/react-query';
import {searchVehicleInformation} from '@atb/modules/smart-park-and-ride';

export const useSearchVehicleInformationQuery = (licensePlate: string) => {
  return useQuery({
    queryKey: ['searchVehicleInformation', licensePlate],
    queryFn: () => searchVehicleInformation(licensePlate),
    enabled: !!licensePlate,
    retry: false,
  });
};
