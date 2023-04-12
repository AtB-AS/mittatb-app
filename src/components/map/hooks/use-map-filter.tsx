import {MapFilterType} from '@atb/components/map/types';
import {storage} from '@atb/storage';
import {useRemoteConfig} from '@atb/RemoteConfigContext';

const STORAGE_KEY = '@ATB_user_map_filters';

export const useUserMapFilters = () => {
  const {default_map_filter} = useRemoteConfig();
  const getMapFilter = () =>
    storage
      .get(STORAGE_KEY)
      .then((storedFilters) =>
        storedFilters
          ? (JSON.parse(storedFilters) as MapFilterType)
          : (JSON.parse(default_map_filter) as MapFilterType),
      );

  const setMapFilter = (filters: MapFilterType) =>
    storage.set(STORAGE_KEY, JSON.stringify(filters));

  return {
    getMapFilter,
    setMapFilter,
  };
};
