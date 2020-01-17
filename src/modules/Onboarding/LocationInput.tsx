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

export type Location = {
  coordinates: [number, number];
  id: string;
  label: string;
  name: string;
};

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
  const reverseLookupFeatures = useReverseGeocoder(debouncedLocation) ?? [];
  const autoCompleteFeatures =
    useGeocoder(debouncedText, debouncedLocation) ?? [];

  type Suggestion = Omit<LocationSuggestionProps, 'onSelectLocation'>;

  const ref = textInputRef ?? internalRef;

  const blurInput = () => ref.current?.blur();

  return (
    <View style={[style, {zIndex: isFocused ? 1 : undefined}]}>
      <Text style={styles.label}>{label}</Text>
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
        <View>
          <Suggestions<Suggestion>
            style={styles.suggestions}
            keyExtractor={suggestion => suggestion.location.id}
            suggestions={
              text && text.length > 2
                ? autoCompleteFeatures
                    .map<Location>(feature => ({
                      coordinates: feature.geometry.coordinates,
                      ...feature.properties,
                    }))
                    .map(location => ({location, type: 'autocomplete'}))
                : reverseLookupFeatures
                    .slice(0, reverseLookupCount ?? 1)
                    .map<Location>(feature => ({
                      coordinates: feature.geometry.coordinates,
                      ...feature.properties,
                    }))
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
      <Text style={styles.suggestionText}>{location.label}</Text>
    </TouchableOpacity>
  );
};

const styles = StyleSheet.create({
  label: {
    color: colors.general.black,
    fontSize: 20,
    marginBottom: 12,
  },
  textInput: {
    width: '100%',
    height: 46,
    fontSize: 20,
    paddingLeft: 12,
    backgroundColor: 'white',
    borderBottomColor: colors.secondary.blue,
    borderBottomWidth: 2,
  },
  suggestions: {
    backgroundColor: colors.general.white,
  },
  suggestion: {
    padding: 12,
  },
  suggestionText: {
    fontSize: 20,
  },
});

export default LocationInput;
