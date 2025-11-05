import {MapFilter, MapFilterType} from '../types';
import {storage} from '@atb/modules/storage';
import {useCallback, useEffect, useState} from 'react';

const MAP_FILTER_STORAGE_KEY = '@ATB_user_map_filters_v2';

// default: show all
const defaultMapFilter: MapFilterType = {
  mobility: {
    CAR: {
      showAll: true,
      operators: [],
    },
    BICYCLE: {
      showAll: true,
      operators: [],
    },
    SCOOTER: {
      showAll: true,
      operators: [],
    },
  },
};

/**
 * This hook should only be used in MapContext.
 */
export const useUserMapFilters = () => {
  const [mapFilter, setMapFilter] = useState<MapFilterType>();

  const getStoredMapFilter = useCallback(async () => {
    const loadedMapFilter = await storage.get(MAP_FILTER_STORAGE_KEY);
    let mapFilter: MapFilterType = defaultMapFilter;
    if (loadedMapFilter) {
      const parseResult = MapFilter.safeParse(JSON.parse(loadedMapFilter));
      if (parseResult.success) {
        mapFilter = parseResult.data;
      }
    }
    return mapFilter;
  }, []);

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
