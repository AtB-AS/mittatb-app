import {TravelSearchFilterOptionWithHitsType} from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_DashboardStack/types';
import {storage, StorageModelTypes} from '@atb/storage';

export class FilterOptionHintsStore<TravelSearchFilterOptionWithHitsType> {
  key: StorageModelTypes;

  constructor(key: StorageModelTypes) {
    this.key = key;
  }

  async getFilterHits(): Promise<TravelSearchFilterOptionWithHitsType[]> {
    const filterHits = await storage.get(this.key);
    return (
      filterHits ? JSON.parse(filterHits) : []
    ) as TravelSearchFilterOptionWithHitsType[];
  }

  async setFilterHits(
    filterViews: TravelSearchFilterOptionWithHitsType[],
  ): Promise<TravelSearchFilterOptionWithHitsType[]> {
    await storage.set(this.key, JSON.stringify(filterViews));
    return filterViews;
  }
}

export const storedFilterHits =
  new FilterOptionHintsStore<TravelSearchFilterOptionWithHitsType>(
    '@ATB_user_filter_hits',
  );
