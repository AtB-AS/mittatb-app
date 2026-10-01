import {MapFilter, MapFilterType} from '../types';
import {storage} from '@atb/modules/storage';
import {useRemoteConfigContext} from '@atb/modules/remote-config';
import {useCallback, useEffect, useState} from 'react';

const MAP_FILTER_STORAGE_KEY = '@ATB_user_map_filters_v2';

const fallback: MapFilterType = {
  mobility: {},
  showFareZones: true,
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
  const res = MapFilter.safeParse(migrateLegacyFilter(JSON.parse(data)));
  return res.success ? res.data : undefined;
};

/**
 * TEMPORARY MIGRATION – remove a couple of releases after this ships.
 *
 * Migrates the renamed `showTariffZones` filter into `showFareZones`. Parsed
 * filters are persisted again on load (see `useUserMapFilters`), so stored data
 * is upgraded to the new shape in place. Once enough releases have passed that
 * stored filters no longer use the old key, delete this function and its call
 * in `parse`.
 */
const migrateLegacyFilter = (raw: unknown) => {
  if (raw && typeof raw === 'object' && 'showTariffZones' in raw) {
    const {showTariffZones, ...rest} = raw as {showTariffZones?: boolean};
    return {showFareZones: showTariffZones, ...rest};
  }
  return raw;
};
