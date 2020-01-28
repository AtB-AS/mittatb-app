import React, {useState, useRef, RefObject} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ViewStyle,
} from 'react-native';
import colors from '../../assets/colors';
import Suggestions from './Suggestions';
import {GeolocationResponse} from '@react-native-community/geolocation';
import {useGeocoder, useReverseGeocoder} from './useGeocoder';
import useDebounce from './useDebounce';
import LocationArrow from '../../assets/svg/LocationArrow';
import {Location} from '../../AppContext';

type Props = {
  location: GeolocationResponse | null;
  text: string;
  onChangeText: (text: string) => void;
  onSelectLocation: (location: Location) => void;
  label: string;
  placeholder: string;
  reverseLookupCount?: number;
  textInputRef?: RefObject<TextInput>;
  style?: ViewStyle;
};

const LocationInput: React.FC<Props> = ({
  location,
  text,
  onChangeText,
  onSelectLocation,
  textInputRef,
  label,
  placeholder,
  reverseLookupCount,
  style,
}) => {
  const internalRef = useRef<TextInput>(null);
  const [isFocused, setIsFocused] = useState<boolean>(false);
  const debouncedLocation = useDebounce(location, 200);
  const debouncedText = useDebounce(text, 200);
  const reverseLookupLocations = useReverseGeocoder(debouncedLocation) ?? [];
  const autoCompleteLocations =
    useGeocoder(debouncedText, debouncedLocation) ?? [];

  type Suggestion = Omit<LocationSuggestionProps, 'onSelectLocation'>;

  const ref = textInputRef ?? internalRef;

  const blurInput = () => ref.current?.blur();

  return (
    <View style={[style, {zIndex: isFocused ? 1 : undefined}]}>
      <TextInput
        ref={ref}
        style={styles.textInput}
        value={text}
        onChangeText={onChangeText}
        onFocus={() => setIsFocused(true)}
        onBlur={() => setIsFocused(false)}
        placeholder={placeholder}
        autoCorrect={false}
        autoCompleteType="off"
      />
      {isFocused ? (
        <View style={styles.suggestionsContainer}>
          <Suggestions<Suggestion>
            style={styles.suggestions}
            keyExtractor={suggestion => suggestion.location.id}
            suggestions={
              text && text.length > 3
                ? autoCompleteLocations.map(location => ({
                    location,
                    type: 'autocomplete',
                  }))
                : reverseLookupLocations
                    .slice(0, reverseLookupCount ?? 1)

                    .map(location => ({location, type: 'reverse'}))
            }
            renderSuggestion={({location, type}) => (
              <LocationSuggestion
                key={location.id}
                location={location}
                type={type}
                onSelectLocation={location => {
                  onSelectLocation(location);
                  blurInput();
                }}
              />
            )}
            noSuggestionsContent={
              <View style={[styles.suggestion]}>
                <Text
                  style={[
                    styles.suggestionText,
                    {color: colors.secondary.orange},
                  ]}
                >
                  Fant ikke adresse.
                </Text>
              </View>
            }
          />
        </View>
      ) : null}
    </View>
  );
};

type LocationSuggestionProps = {
  location: Location;
  type: 'autocomplete' | 'reverse';
  onSelectLocation: (location: Location) => void;
};

const LocationSuggestion: React.FC<LocationSuggestionProps> = ({
  location,
  type,
  onSelectLocation,
}) => {
  return (
    <TouchableOpacity
      style={styles.suggestion}
      key={location.id}
      onPress={() => onSelectLocation(location)}
    >
      {type === 'autocomplete' ? (
        <Text style={styles.suggestionText}>{location.label}</Text>
      ) : (
        <View style={styles.reverseSuggestionContainer}>
          <View>
            <Text style={styles.suggestionText}>Min posisjon</Text>
            <Text style={styles.suggestionMinText}>{location.label}</Text>
          </View>
          <LocationArrow />
        </View>
      )}
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  textInput: {
    width: '100%',
    height: 46,
    fontSize: 20,
    paddingLeft: 12,
    backgroundColor: colors.general.white,
    borderBottomColor: colors.secondary.blue,
    borderBottomWidth: 2,
  },
  suggestionsContainer: {
    elevation: 4,
    shadowOffset: {width: 5, height: 5},
    shadowOpacity: 0.75,
    shadowRadius: 10,
    shadowColor: colors.general.black,
  },
  suggestions: {
    backgroundColor: colors.general.white,
  },
  suggestion: {
    padding: 12,
  },
  reverseSuggestionContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  suggestionText: {
    fontSize: 20,
  },
  suggestionMinText: {
    marginTop: 4,
    fontSize: 12,
  },
});

export default LocationInput;
