import {MapFilter} from '@atb/components/map/types';
import {useState} from 'react';

const defaultFilter: MapFilter = {
  vehicles: {
    showVehicles: true,
  },
};

export const useUserMapFilters = () => {
  const [userFilter, setUserFilter] = useState<MapFilter>(defaultFilter);

  const getMapFilter = () => {
    return Promise.resolve(userFilter);
  };
  const setMapFilter = (f: MapFilter) => {
    setUserFilter(f);
  };

  return {
    getMapFilter,
    setMapFilter,
  };
};
