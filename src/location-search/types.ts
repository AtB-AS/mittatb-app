import {RootStackScreenProps} from '@atb/navigation/types';
import {JourneySearchHistoryEntry} from '@atb/search-history/types';
import {CompositeScreenProps} from '@react-navigation/native';
import {StackScreenProps} from '@react-navigation/stack';
import {
  Location,
  SearchLocation,
  StoredLocationFavorite,
} from '../favorites/types';
import {RouteParams as LocationSearchRouteParams} from './LocationSearch';
import {RouteParams as MapSelectionRouteParams} from './map-selection';

export type LocationSearchResult = {
  location: SearchLocation;
  favoriteInfo?: Omit<StoredLocationFavorite, 'location'>;
};

export type SelectableLocationData =
  | Location
  | {
      resultType: 'journey';
      journeyData: JourneySearchHistoryEntry;
    };

// Routing

export type LocationSearchStackParams = {
  LocationSearchMain: LocationSearchRouteParams;
  MapSelection: MapSelectionRouteParams;
};

export type LocationSearchRootProps = RootStackScreenProps<'LocationSearch'>;

export type LocationSearchScreenProps<
  T extends keyof LocationSearchStackParams,
> = CompositeScreenProps<
  StackScreenProps<LocationSearchStackParams, T>,
  LocationSearchRootProps
>;
