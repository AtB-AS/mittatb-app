import {useCallback} from 'react';
import {FormFactor} from '@atb/api/types/generated/mobility-types_v2';
import {useMapContext} from '../MapContext';
import {MapFilterType} from '../types';

/**
 * Returns a callback which turns on the map filter for the given form factors,
 * so that the vehicles are visible in the map even if the user has previously
 * turned the filter off. The updated filter is both stored and returned, so it
 * can be passed on as the initial filter state for the map screen.
 *
 * Returns undefined if the stored map filter is not loaded yet, which may
 * happen if the app is cold started from a deeplink.
 */
export const useEnableFormFactorsInMapFilter = () => {
  const {mapFilter, setMapFilter} = useMapContext();

  return useCallback(
    (formFactors: FormFactor[]): MapFilterType | undefined => {
      if (!mapFilter) return undefined;
      if (formFactors.length === 0) return mapFilter;

      const updatedMobility = {...mapFilter.mobility};
      formFactors.forEach((formFactor) => {
        updatedMobility[formFactor] = {
          operators: updatedMobility[formFactor]?.operators ?? [],
          showAll: true,
        };
      });
      const updatedFilter = {...mapFilter, mobility: updatedMobility};
      setMapFilter(updatedFilter);
      return updatedFilter;
    },
    [mapFilter, setMapFilter],
  );
};
