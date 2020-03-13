import React, {useState, useRef, RefObject} from 'react';
import {
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
  ViewStyle,
} from 'react-native';
import colors from '../../theme/colors';
import Suggestions from './Suggestions';
import {GeolocationResponse} from '@react-native-community/geolocation';
import {useGeocoder, useReverseGeocoder} from './useGeocoder';
import useDebounce from './useDebounce';
import LocationArrow from '../../assets/svg/LocationArrow';
import {Location} from '../../favorites/types';

type Props = {
  location: GeolocationResponse | null;
  text: string;
  onChangeText: (text: string) => void;
  hintText?: string;
  error?: string | null;
  onSelectLocation: (location: Location) => void;
  placeholder: string;
  reverseLookupCount?: number;
  textInputRef?: RefObject<TextInput>;
  style?: ViewStyle;
  testID: string;
};

const LocationInput: React.FC<Props> = ({
  location,
  text,
  onChangeText,
  hintText,
  error,
  onSelectLocation,
  textInputRef,
  placeholder,
  reverseLookupCount,
  style,
  testID,
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
          style={[
            styles.textInput,
            {
              borderBottomColor: !error
                ? colors.secondary.blue
                : colors.secondary.red,
            },
          ]}
          value={text}
          onChangeText={onChangeText}
          onFocus={() => setIsFocused(true)}
          onBlur={() => setIsFocused(false)}
          placeholder={placeholder}
          autoCorrect={false}
          autoCompleteType="off"
          placeholderTextColor="#2C353B"
          testID={testID + 'Input'}
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
            noSuggestionsContent={<NoSuggestion />}
          />
        </View>
      ) : error ? (
        <Error message={error} />
      ) : null}
    </View>
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
    borderBottomWidth: 2,
    color: colors.general.black,
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
});

export default LocationInput;

const Error: React.FC<{message: string}> = ({message}) => {
  return (
    <>
      <View style={errorStyles.arrow} />
      <View style={errorStyles.box}>
        <Text style={errorStyles.message}>{message}</Text>
      </View>
    </>
  );
};

const errorStyles = StyleSheet.create({
  arrow: {
    width: 0,
    height: 0,
    backgroundColor: 'transparent',
    borderLeftColor: 'transparent',
    borderRightColor: 'transparent',
    borderBottomColor: colors.secondary.red,
    borderLeftWidth: 10,
    borderRightWidth: 10,
    borderBottomWidth: 10,
    marginTop: 4,
    marginLeft: 12,
    marginBottom: -1,
  },
  box: {backgroundColor: colors.secondary.red, padding: 12},
  message: {color: colors.general.white, fontSize: 17},
});

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
      style={suggestionStyles.suggestion}
      key={location.id}
      onPress={() => onSelectLocation(location)}
    >
      {type === 'reverse' ? (
        <LocationArrow style={suggestionStyles.locationArrow} />
      ) : null}
      <View>
        <Text testID="suggestionText" style={suggestionStyles.suggestionText}>
          {location.name}
        </Text>
        <Text style={suggestionStyles.suggestionMinText}>
          {location.locality}
        </Text>
      </View>
    </TouchableOpacity>
  );
};

const NoSuggestion: React.FC = () => {
  return (
    <View style={[suggestionStyles.suggestion]}>
      <Text
        style={[
          suggestionStyles.suggestionText,
          {color: colors.secondary.orange},
        ]}
      >
        Fant ikke adresse.
      </Text>
    </View>
  );
};

const suggestionStyles = StyleSheet.create({
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
