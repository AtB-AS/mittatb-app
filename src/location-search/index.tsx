import React, {useState} from 'react';
import {Text, View, TextStyle} from 'react-native';
import {TextInput, ScrollView} from 'react-native-gesture-handler';
import {NavigationProp} from '@react-navigation/native';
import {StyleSheet} from '../theme';
import {Location} from '../favorites/types';
import InputSearchIcon from './svg/InputSearchIcon';
import useDebounce from './useDebounce';
import {useGeocoder} from './useGeocoder';
import LocationResults from './LocationResults';
import FavoriteChips from './FavoriteChips';
import {useGeolocationState} from '../GeolocationContext';
import {SharedElement} from 'react-navigation-shared-element';

export type Props = {
  navigation: NavigationProp<any>;
  onSelectLocation: (location: Location) => void;
};

const LocationSearch: React.FC<Props> = ({navigation, onSelectLocation}) => {
  const styles = useThemeStyles();

  const [text, setText] = useState<string>('');
  const debouncedText = useDebounce(text, 200);

  const previousLocations = filterPreviousLocations(debouncedText, [
    {
      coordinates: {
        latitude: 63.279993,
        longitude: 9.836737,
      },
      id: 'NSR:StopPlace:43150',
      name: 'Sorenskrivergården',
      label: 'Sorenskrivergården, Orkland',
      locality: 'Orkland',
    } as Location,
  ]);

  const {location: geolocation} = useGeolocationState();

  const locations = useGeocoder(debouncedText, geolocation);
  const filteredLocations = filterCurrentLocation(locations, previousLocations);

  const onSelect = (location: Location) => {
    onSelectLocation(location);
    navigation.goBack();
  };

  return (
    <View style={styles.container}>
      <Text style={styles.label}>Adresse eller stoppested</Text>
      <SharedElement id="locationSearchInput">
        <View style={styles.inputContainer}>
          <TextInput
            style={styles.input}
            value={text}
            autoFocus={true}
            onChangeText={setText}
            placeholder="Søk etter adresse eller stoppested"
            autoCorrect={false}
            autoCompleteType="off"
            placeholderTextColor={(styles.placeholder as TextStyle).color}
          />
          <InputSearchIcon style={styles.searchIcon} />
        </View>
      </SharedElement>
      {!locations && (
        <FavoriteChips onSelectLocation={onSelect} geolocation={geolocation} />
      )}
      <ScrollView>
        {!!previousLocations && (
          <LocationResults
            title="Tidligere søk"
            locations={previousLocations}
            onSelect={onSelect}
          />
        )}
        {!!filteredLocations && (
          <LocationResults
            title="Søkeresultat"
            locations={filteredLocations}
            onSelect={onSelect}
          />
        )}
      </ScrollView>
    </View>
  );
};

const filterPreviousLocations = (
  searchText: string,
  previousLocations: Location[],
): Location[] =>
  searchText
    ? previousLocations.filter(l =>
        l.name?.toLowerCase()?.startsWith(searchText.toLowerCase()),
      )
    : previousLocations;

const filterCurrentLocation = (
  locations: Location[] | null,
  previousLocations: Location[] | null,
) => {
  if (!previousLocations?.length) return locations;
  return locations?.filter(l => !previousLocations.some(pl => pl.id === l.id));
};

const useThemeStyles = StyleSheet.createThemeHook(theme => ({
  container: {
    backgroundColor: theme.background.secondary,
    flex: 1,
    padding: theme.sizes.pagePadding,
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
    backgroundColor: theme.background.primary,
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
}));

export default LocationSearch;
