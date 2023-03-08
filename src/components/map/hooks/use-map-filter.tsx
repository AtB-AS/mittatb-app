import {MapFilter} from '@atb/components/map/types';
import storage from '@atb/storage';

const DEFAULT_FILTER: MapFilter = {
  vehicles: {
    showVehicles: true,
  },
};
const STORAGE_KEY = '@ATB_user_map_filters';

export const useUserMapFilters = () => {
  const getMapFilter = () =>
    storage
      .get(STORAGE_KEY)
      .then((storedFilters) =>
        storedFilters
          ? (JSON.parse(storedFilters) as MapFilter)
          : DEFAULT_FILTER,
      );

  const setMapFilter = (filters: MapFilter) =>
    storage.set(STORAGE_KEY, JSON.stringify(filters));

  return {
    getMapFilter,
    setMapFilter,
  };
};
