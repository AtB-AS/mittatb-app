import {TravelSearchFiltersSelectionType} from '@atb/stacks-hierarchy/Root_TabNavigatorStack/TabNav_DashboardStack/types';
import {storage, StorageModelTypes} from '@atb/storage';

class FilterStore<TravelSearchFiltersSelectionType> {
  key: StorageModelTypes;

  constructor(key: StorageModelTypes) {
    this.key = key;
  }

  async getFilters(): Promise<TravelSearchFiltersSelectionType> {
    const userFilters = await storage.get(this.key);
    return (
      userFilters ? JSON.parse(userFilters) : {}
    ) as TravelSearchFiltersSelectionType;
  }

  async setFilters(
    filters: TravelSearchFiltersSelectionType,
  ): Promise<TravelSearchFiltersSelectionType> {
    await storage.set(this.key, JSON.stringify(filters));
    return filters;
  }
}

export const storedFilters = new FilterStore<TravelSearchFiltersSelectionType>(
  '@ATB_user_travel_search_filters_v2',
);
