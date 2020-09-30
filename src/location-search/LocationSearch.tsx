import {RouteProp, useIsFocused} from '@react-navigation/native';
import React, {useEffect, useRef, useState} from 'react';
import {Text, TextInput, View, Keyboard} from 'react-native';
import {ScrollView} from 'react-native-gesture-handler';
import Header from '../ScreenHeader';
import Input from '../components/input';
import {Location, LocationWithMetadata} from '../favorites/types';
import {useGeolocationState} from '../GeolocationContext';
import {RootStackParamList} from '../navigation';
import {useSearchHistory} from '../search-history';
import {StyleSheet} from '../theme';
import colors from '../theme/colors';
import FavoriteChips, {ChipTypeGroup} from '../favorite-chips';
import LocationResults from './LocationResults';
import useDebounce from './useDebounce';
import {LocationSearchNavigationProp} from './';
import {TRONDHEIM_CENTRAL_STATION} from '../api/geocoder';
import {Close} from '../assets/svg/icons/actions';
import {SafeAreaView} from 'react-native-safe-area-context';
import {useGeocoder} from '../geocoder';

export type Props = {
  navigation: LocationSearchNavigationProp;
  route: RouteProp<RootStackParamList, 'LocationSearch'>;
};

export type RouteParams = {
  callerRouteName: string;
  callerRouteParam: string;
  label: string;
  favoriteChipTypes?: ChipTypeGroup[];
  initialLocation?: LocationWithMetadata;
};

const LocationSearch: React.FC<Props> = ({
  navigation,
  route: {
    params: {
      callerRouteName,
      callerRouteParam,
      label,
      favoriteChipTypes,
      initialLocation,
    },
  },
}) => {
  const styles = useThemeStyles();
  const {history, addSearchEntry} = useSearchHistory();

  const [text, setText] = useState<string>(initialLocation?.name ?? '');
  const debouncedText = useDebounce(text, 200);

  const previousLocations = filterPreviousLocations(debouncedText, history);

  const {
    location: geolocation,
    requestPermission: requestGeoPermission,
  } = useGeolocationState();

  const {locations} =
    useGeocoder(debouncedText, geolocation?.coords ?? null) ?? [];
  const filteredLocations = filterCurrentLocation(locations, previousLocations);

  const onSelect = (location: LocationWithMetadata) => {
    if (location.resultType === 'search') {
      addSearchEntry(location);
    }
    navigation.navigate(callerRouteName as any, {
      [callerRouteParam]: location,
    });
  };

  const onMapSelection = () => {
    const coordinates: {
      latitude: number;
      longitude: number;
      zoomLevel: number;
    } = initialLocation
      ? {...initialLocation.coordinates, zoomLevel: 12}
      : geolocation
      ? {...geolocation.coords, zoomLevel: 12}
      : {...TRONDHEIM_CENTRAL_STATION, zoomLevel: 6};

    navigation.navigate('MapSelection', {
      callerRouteName,
      callerRouteParam,
      coordinates: coordinates,
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
    <SafeAreaView style={styles.container}>
      <View style={{paddingTop: 12, flex: 1}}>
        <View style={{marginHorizontal: 20}}>
          <Header
            leftButton={{
              onPress: () => navigation.goBack(),
              accessible: true,
              accessibilityRole: 'button',
              accessibilityLabel: 'Gå tilbake',
              icon: <Close />,
            }}
            title="Søk"
          />
        </View>

        <View style={[{marginTop: 12}, styles.contentBlock]}>
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

        <View>
          <FavoriteChips
            onSelectLocation={onSelect}
            onMapSelection={onMapSelection}
            chipTypes={favoriteChipTypes}
            containerStyle={[styles.contentBlock, styles.chipBox]}
          />
        </View>

        {hasAnyResult ? (
          <ScrollView
            style={styles.scroll}
            contentContainerStyle={styles.contentBlock}
            keyboardShouldPersistTaps="handled"
            onScrollBeginDrag={() => Keyboard.dismiss()}
          >
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
    </SafeAreaView>
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
  },
  contentBlock: {
    paddingHorizontal: theme.spacings.medium,
  },
  scroll: {
    flex: 1,
  },
  chipBox: {
    marginBottom: 12,
  },
  label: {
    fontSize: 14,
    lineHeight: 20,
    position: 'absolute',
    left: 12,
  },
  placeholder: {
    color: theme.text.colors.faded,
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
    color: theme.text.colors.primary,
  },
  searchIcon: {
    position: 'absolute',
    left: 14,
    alignSelf: 'center',
  },
}));

export default LocationSearch;
