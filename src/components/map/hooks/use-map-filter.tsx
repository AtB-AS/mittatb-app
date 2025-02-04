import {MapFilter, MapFilterType} from '../types';
import {storage} from '@atb/storage';
import {useRemoteConfigContext} from '@atb/RemoteConfigContext';
import {useCallback} from 'react';

const STORAGE_KEY = '@ATB_user_map_filters';

const fallback: MapFilterType = {
  mobility: {},
};

export const useUserMapFilters = () => {
  const {default_map_filter} = useRemoteConfigContext();
  const getMapFilter = useCallback(
    () =>
      storage
        .get(STORAGE_KEY)
        .then((storedFilters) =>
          storedFilters
            ? parse(storedFilters) ?? fallback
            : parse(default_map_filter) ?? fallback,
        ),
    [default_map_filter],
  );

  const setMapFilter = useCallback(
    (filters: MapFilterType) =>
      storage.set(STORAGE_KEY, JSON.stringify(filters)),
    [],
  );

  return {
    getMapFilter,
    setMapFilter,
  };
};

const parse = (data: string) => {
  const res = MapFilter.safeParse(JSON.parse(data));
  return res.success ? res.data : undefined;
};
