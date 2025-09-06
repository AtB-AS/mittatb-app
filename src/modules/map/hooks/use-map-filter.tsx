import {MapFilter, MapFilterType} from '../types';
import {storage} from '@atb/modules/storage';
import {useRemoteConfigContext} from '@atb/modules/remote-config';
import {useCallback, useEffect, useState} from 'react';

const MAP_FILTER_STORAGE_KEY = '@ATB_user_map_filters_v2';

const fallback: MapFilterType = {
  mobility: {},
};

/**
 * This hook should only be used in MapContext.
 */
export const useUserMapFilters = () => {
  const {default_map_filter} = useRemoteConfigContext();
  const [mapFilter, setMapFilter] = useState<MapFilterType>();

  const getStoredMapFilter = useCallback(
    () =>
      storage
        .get(MAP_FILTER_STORAGE_KEY)
        .then((storedFilters) =>
          storedFilters
            ? (parse(storedFilters) ?? fallback)
            : (parse(default_map_filter) ?? fallback),
        ),
    [default_map_filter],
  );

  const setAndStoreMapFilter = useCallback(
    (filters: MapFilterType) => {
      storage.set(MAP_FILTER_STORAGE_KEY, JSON.stringify(filters));
      setMapFilter(filters);
    },
    [setMapFilter],
  );

  useEffect(() => {
    // inital load locally stored filter
    getStoredMapFilter().then((mapFilterFromStorage) =>
      setAndStoreMapFilter(mapFilterFromStorage),
    );
  }, [getStoredMapFilter, setAndStoreMapFilter]);

  return {
    mapFilter,
    setMapFilter: setAndStoreMapFilter,
  };
};

const parse = (data: string) => {
  const res = MapFilter.safeParse(JSON.parse(data));
  return res.success ? res.data : undefined;
};
