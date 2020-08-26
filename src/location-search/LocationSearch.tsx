import {
  NavigationProp,
  ParamListBase,
  RouteProp,
  useIsFocused,
  useRoute,
} from '@react-navigation/native';
import React, {useEffect, useRef, useState} from 'react';
import {Text, TextInput, View} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import Input from '../components/input';
import {Location} from '../favorites/types';
import {useGeolocationState} from '../GeolocationContext';
import {RootStackParamList} from '../navigation';
import {useSearchHistory} from '../search-history';
import {StyleSheet} from '../theme';
import colors from '../theme/colors';
import FavoriteChips from './FavoriteChips';
import LocationResults from './LocationResults';
import useDebounce from './useDebounce';
import {useGeocoder} from './useGeocoder';
import {LocationWithSearchMetadata} from './';

export type Props = {
  navigation: NavigationProp<any>;
  route: RouteProp<RootStackParamList, 'LocationSearch'>;
};

export type RouteParams = {
  callerRouteName: string;
  callerRouteParam: string;
  label: string;
  hideFavorites?: boolean;
  initialText?: string;
};

const LocationSearch: React.FC<Props> = ({
  navigation,
  route: {
    params: {
      callerRouteName,
      callerRouteParam,
      label,
      hideFavorites,
      initialText,
    },
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
        <Input
          ref={inputRef}
          label={label}
          value={text}
          onChangeText={setText}
          showClear={Boolean(text?.length)}
          onClear={() => setText('')}
          placeholder="Søk etter adresse eller stoppested"
          autoCorrect={false}
          autoCompleteType="off"
        />
      </View>

      <FavoriteChips
        onSelectLocation={onSelect}
        geolocation={geolocation}
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
    fontSize: 14,
    lineHeight: 20,
    position: 'absolute',
    left: 12,
  },
  placeholder: {
    color: theme.text.faded,
  },
  inputContainer: {
    width: '100%',
    height: 46,
    flexDirection: 'column',
    marginBottom: 24,
    justifyContent: 'center',
  },
  input: {
    flex: 1,
    fontSize: 16,
    paddingLeft: 60,
    backgroundColor: theme.background.level1,
    borderWidth: 1,
    borderColor: colors.general.gray,
    borderRadius: 4,
    color: theme.text.primary,
  },
  searchIcon: {
    position: 'absolute',
    left: 14,
    alignSelf: 'center',
  },
}));

export default LocationSearch;
