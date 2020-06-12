import React, {useState, useRef, useEffect} from 'react';
import {Text, TextInput, View, TextStyle} from 'react-native';
import {ScrollView, TouchableOpacity} from 'react-native-gesture-handler';
import {
  NavigationProp,
  RouteProp,
  useRoute,
  ParamListBase,
  useIsFocused,
} from '@react-navigation/native';
import {StyleSheet} from '../theme';
import {Location} from '../favorites/types';
import InputSearchIcon from './svg/InputSearchIcon';
import useDebounce from './useDebounce';
import {useGeocoder} from './useGeocoder';
import LocationResults from './LocationResults';
import FavoriteChips from './FavoriteChips';
import {useGeolocationState} from '../GeolocationContext';
import {SharedElement} from 'react-navigation-shared-element';
import {RootStackParamList} from '../navigation';
import {useSearchHistory} from '../search-history';
import {Close} from '../assets/svg/icons/actions';
import insets from '../utils/insets';

export type Props = {
  navigation: NavigationProp<any>;
  route: RouteProp<RootStackParamList, 'LocationSearch'>;
};

export type RouteParams = {
  callerRouteName: string;
  callerRouteParam: string;
  hideFavorites?: boolean;
  initialText?: string;
};

const LocationSearch: React.FC<Props> = ({
  navigation,
  route: {
    params: {callerRouteName, callerRouteParam, hideFavorites, initialText},
  },
}) => {
  const styles = useThemeStyles();
  const {history, addSearchEntry} = useSearchHistory();

  const [text, setText] = useState<string>(initialText ?? '');
  const debouncedText = useDebounce(text, 200);

  const previousLocations = filterPreviousLocations(debouncedText, history);

  const {
    location: geolocation,
    status: geostatus,
    requestPermission: requestGeoPermission,
  } = useGeolocationState();

  const locations = useGeocoder(debouncedText, geolocation) ?? [];
  const filteredLocations = filterCurrentLocation(locations, previousLocations);

  const onSelect = (location: LocationWithSearchMetadata) => {
    if (location.resultType === 'search') {
      addSearchEntry(location);
    }
    navigation.navigate(callerRouteName, {
      [callerRouteParam]: location,
    });
  };

  const onSearchSelect = (location: Location) =>
    onSelect({...location, resultType: 'search'});

  const inputRef = useRef<TextInput>(null);

  const isFocused = useIsFocused();

  // using setTimeout to counteract issue of other elements
  // capturing focus on mount and on press
  const focusInput = () => setTimeout(() => inputRef.current?.focus(), 0);

  useEffect(() => {
    if (isFocused) focusInput();
  }, [isFocused]);

  const onPrefillText = (text: string) => {
    setText(text);
    focusInput();
  };

  const hasPreviousResults = !!previousLocations.length;
  const hasResults = !!filteredLocations.length;
  const hasAnyResult = hasResults || hasPreviousResults;

  return (
    <View style={styles.container}>
      <View style={styles.contentBlock}>
        <Text style={styles.label}>Adresse eller stoppested</Text>
        <SharedElement id="locationSearchInput">
          <View style={styles.inputContainer}>
            <TextInput
              ref={inputRef}
              style={styles.input}
              value={text}
              onChangeText={setText}
              placeholder="Søk etter adresse eller stoppested"
              autoCorrect={false}
              autoCompleteType="off"
              placeholderTextColor={(styles.placeholder as TextStyle).color}
            />
            <InputSearchIcon style={styles.searchIcon} />
            {text?.length ? (
              <View style={styles.searchClear}>
                <TouchableOpacity
                  hitSlop={insets.all(8)}
                  onPress={() => setText('')}
                >
                  <Close />
                </TouchableOpacity>
              </View>
            ) : null}
          </View>
        </SharedElement>
      </View>

      <FavoriteChips
        onSelectLocation={onSelect}
        geolocation={geolocation}
        geostatus={geostatus}
        requestGeoPermission={requestGeoPermission}
        hideFavorites={!!hideFavorites}
        containerStyle={styles.contentBlock}
      />

      {hasAnyResult ? (
        <ScrollView style={styles.contentBlock}>
          {hasPreviousResults && (
            <LocationResults
              title="Tidligere søk"
              locations={previousLocations}
              onSelect={onSearchSelect}
              onPrefillText={onPrefillText}
            />
          )}
          {hasResults && (
            <LocationResults
              title="Søkeresultat"
              locations={filteredLocations}
              onSelect={onSearchSelect}
              onPrefillText={onPrefillText}
            />
          )}
        </ScrollView>
      ) : (
        <View style={styles.contentBlock}>
          <Text>Fant ingen søkeresultat</Text>
        </View>
      )}
    </View>
  );
};

const filterPreviousLocations = (
  searchText: string,
  previousLocations: Location[],
): Location[] =>
  searchText
    ? previousLocations.filter((l) =>
        l.name?.toLowerCase()?.startsWith(searchText.toLowerCase()),
      )
    : previousLocations;

const filterCurrentLocation = (
  locations: Location[] | null,
  previousLocations: Location[] | null,
): Location[] => {
  if (!previousLocations?.length) return locations ?? [];
  if (!locations) return [];
  return locations.filter(
    (l) => !previousLocations.some((pl) => pl.id === l.id),
  );
};

const useThemeStyles = StyleSheet.createThemeHook((theme) => ({
  container: {
    backgroundColor: theme.background.level2,
    flex: 1,
    paddingTop: 12,
  },
  contentBlock: {
    paddingHorizontal: theme.sizes.pagePadding,
  },
  label: {
    fontSize: 12,
    marginBottom: 8,
  },
  placeholder: {
    color: theme.text.faded,
  },
  inputContainer: {
    width: '100%',
    height: 46,
    flexDirection: 'row',
    marginBottom: 24,
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingLeft: 44,
    backgroundColor: theme.background.level1,
    borderBottomWidth: 2,
    borderRadius: 4,
    borderBottomColor: theme.border.primary,
    color: theme.text.primary,
  },
  searchIcon: {
    position: 'absolute',
    left: 14,
    alignSelf: 'center',
  },
  searchClear: {
    position: 'absolute',
    right: 14,
    alignSelf: 'center',
  },
}));

export type LocationResultType = 'search' | 'geolocation' | 'favorite';

export type LocationWithSearchMetadata = Location &
  (
    | {
        resultType: 'search' | 'geolocation';
      }
    | {resultType: 'favorite'; favoriteId: string}
  );

export function useLocationSearchValue<
  T extends RouteProp<any, any> & {params: ParamListBase}
>(
  callerRouteParam: keyof T['params'],
  defaultLocation?: Location,
): LocationWithSearchMetadata | undefined {
  const route = useRoute<T>();
  const [location, setLocation] = React.useState<
    LocationWithSearchMetadata | undefined
  >(defaultLocation && {...defaultLocation, resultType: 'search'});

  React.useEffect(() => {
    if (route.params?.[callerRouteParam]) {
      setLocation(route.params?.[callerRouteParam]);
    }
  }, [route.params?.[callerRouteParam]]);

  return location;
}

export default LocationSearch;
