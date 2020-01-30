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
  hintText?: string;
  onSelectLocation: (location: Location) => void;
  placeholder: string;
  reverseLookupCount?: number;
  textInputRef?: RefObject<TextInput>;
  style?: ViewStyle;
};

const LocationInput: React.FC<Props> = ({
  location,
  text,
  onChangeText,
  hintText,
  onSelectLocation,
  textInputRef,
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
    <View style={style}>
      <View style={styles.textInputContainer}>
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
        {hintText ? <Text style={styles.hintText}>{hintText}</Text> : null}
      </View>
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
      {type === 'reverse' ? (
        <LocationArrow style={styles.locationArrow} />
      ) : null}
      <View>
        <Text style={styles.suggestionText}>{location.name}</Text>
        <Text style={styles.suggestionMinText}>{location.locality}</Text>
      </View>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  textInputContainer: {
    width: '100%',
    height: 46,
    flexDirection: 'row',
  },
  textInput: {
    flex: 1,
    fontSize: 20,
    paddingLeft: 12,
    backgroundColor: colors.general.white,
    borderBottomColor: colors.secondary.blue,
    borderBottomWidth: 2,
  },
  hintText: {
    position: 'absolute',
    right: 5,
    alignSelf: 'center',
    opacity: 0.4,
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
    flexDirection: 'row',
  },
  locationArrow: {
    marginTop: 3,
    marginRight: 5,
  },
  suggestionText: {
    fontSize: 17,
  },
  suggestionMinText: {
    opacity: 0.4,
    marginTop: 4,
    fontSize: 12,
  },
});

export default LocationInput;
