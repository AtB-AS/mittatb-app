import {MapFilter} from '@atb/components/map/types';
import storage from '@atb/storage';
import {useRemoteConfig} from '@atb/RemoteConfigContext';

const STORAGE_KEY = '@ATB_user_map_filters';

export const useUserMapFilters = () => {
  const {default_map_filter} = useRemoteConfig();
  const getMapFilter = () =>
    storage
      .get(STORAGE_KEY)
      .then((storedFilters) =>
        storedFilters
          ? (JSON.parse(storedFilters) as MapFilter)
          : (JSON.parse(default_map_filter) as MapFilter),
      );

  const setMapFilter = (filters: MapFilter) =>
    storage.set(STORAGE_KEY, JSON.stringify(filters));

  return {
    getMapFilter,
    setMapFilter,
  };
};
