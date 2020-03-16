import React, {useState} from 'react';
import {Text, View, TextStyle} from 'react-native';
import {TextInput} from 'react-native-gesture-handler';
import {NavigationProp} from '@react-navigation/native';
import {StyleSheet} from '../theme';
import {Location} from '../favorites/types';
import InputSearchIcon from './svg/InputSearchIcon';
import useDebounce from './useDebounce';
import {useGeocoder} from './useGeocoder';
import LocationResults from './LocationResults';
import FavoriteChips from './FavoriteChips';

export type Props = {
  navigation: NavigationProp<any>;
  onSelectLocation: (location: Location) => void;
};

const LocationSearch: React.FC<Props> = ({navigation, onSelectLocation}) => {
  const styles = useThemeStyles();

  const [text, setText] = useState<string>('');
  const debouncedText = useDebounce(text, 200);
  const locations = useGeocoder(debouncedText, null);
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Adresse eller stoppested</Text>
      <View style={styles.inputContainer}>
        <TextInput
          style={styles.input}
          value={text}
          onChangeText={setText}
          placeholder="Søk etter adresse eller stoppested"
          autoCorrect={false}
          autoCompleteType="off"
          placeholderTextColor={(styles.placeholder as TextStyle).color}
        />
        <InputSearchIcon style={styles.searchIcon} />
      </View>
      {!locations && <FavoriteChips />}
      {!!locations && (
        <LocationResults
          title="Søkeresultat"
          locations={locations}
          onSelect={searchLocation => {
            onSelectLocation(searchLocation);
            navigation.goBack();
          }}
        />
      )}
    </View>
  );
};

const useThemeStyles = StyleSheet.createThemeHook(theme => ({
  container: {
    backgroundColor: theme.background.secondary,
    flex: 1,
    padding: 24,
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
