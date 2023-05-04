import {useFilters} from '@atb/travel-search-filters';
import {TravelSearchFilterOptionWithHitsType} from '../types';

export const useFilterHits = () => {
  const {filterHits, setFilterHits} = useFilters();

  const incrementHits = (filterId: string) => {
    if (filterHits.find(({id}) => id === filterId)) {
      const updatedFilterHits = filterHits.map((filter) => {
        if (filter.id === filterId) {
          return {...filter, hits: filter.hits + 1};
        }

        return filter;
      });

      setFilterHits(updatedFilterHits);
    } else {
      setFilterHits([
        ...filterHits,
        {
          id: filterId,
          hits: 1,
        } as TravelSearchFilterOptionWithHitsType,
      ]);
    }
  };

  return {
    hitsForFilter: (filterId?: string) => {
      const filter = filterHits.find(({id}) => id === filterId);
      return filter ? filter.hits : 0;
    },
    incrementHints: incrementHits,
  };
};
