import {MapFilter, MapFilterType} from '../types';
import {storage} from '@atb/modules/storage';
import {useRemoteConfigContext} from '@atb/modules/remote-config';
import {useCallback, useEffect, useState} from 'react';

const STORAGE_KEY = '@ATB_user_map_filters_v2';

const fallback: MapFilterType = {
  mobility: {},
};

/**
 * This hook should only be used in MapContext.
 */
export const useUserMapFilters = () => {
  const {default_map_filter} = useRemoteConfigContext();
  const [mapFilter, setMapFilterInContext] = useState<MapFilterType>();

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
    (filters: MapFilterType) => {
      storage.set(STORAGE_KEY, JSON.stringify(filters));
      setMapFilterInContext(filters);
    },
    [setMapFilterInContext],
  );

  useEffect(() => {
    // inital load locally stored filter
    getMapFilter().then((mapFilterFromStorage) =>
      setMapFilter(mapFilterFromStorage),
    );
  }, [getMapFilter, setMapFilter]);

  return {
    mapFilter,
    setMapFilter,
  };
};

const parse = (data: string) => {
  const res = MapFilter.safeParse(JSON.parse(data));
  return res.success ? res.data : undefined;
};
