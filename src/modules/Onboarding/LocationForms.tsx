import React, {useState, useRef, useContext} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TouchableWithoutFeedback,
  TextInput,
} from 'react-native';
import colors from '../../assets/colors';
import LocationInput, {Location} from './LocationInput';
import {useGeolocation} from '../../geolocation';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {StackNavigationProp} from '@react-navigation/stack';
import {OnboardingStackParamList, OnboardingContext} from './';
import {GeolocationResponse} from '@react-native-community/geolocation';

type Props = {
  location: GeolocationResponse | null;
  question: string;
  label: string;
  placeholder: string;
  buttonText: string;
  onLocationSelect: (location: Location) => void;
};

export const HomeLocation: React.FC<{
  navigation: StackNavigationProp<OnboardingStackParamList>;
}> = ({navigation}) => {
  const context = useContext(OnboardingContext);
  return (
    <LocationForm
      key="homeForm"
      location={context?.location ?? null}
      question="Hvor bor du?"
      label="Hjemmeadresse"
      placeholder="Legg til hjemmeadresse"
      buttonText="Neste"
      onLocationSelect={(location: Location) => {
        if (context) {
          context.setHomeLocation(location);
          navigation.push('WorkLocation');
        }
      }}
    />
  );
};

export const WorkLocation: React.FC<{
  navigation: StackNavigationProp<OnboardingStackParamList>;
}> = () => {
  const context = useContext(OnboardingContext);
  return (
    <LocationForm
      key="workForm"
      location={context?.location ?? null}
      question="Hvor jobber du?"
      label="Jobbadresse"
      placeholder="Legg til jobbadresse"
      buttonText="Neste"
      onLocationSelect={(location: Location) => {
        if (context) {
          context.setWorkLocation(location);
          context.completeOnboarding();
        }
      }}
    />
  );
};

const LocationForm: React.FC<Props> = ({
  location,
  question,
  label,
  placeholder,
  buttonText,
  onLocationSelect,
}) => {
  const [address, setAddress] = useState<string>('');
  const [addressLocation, setAddressLocation] = useState<Location | null>(null);

  const textInputRef = useRef<TextInput>(null);
  const blurInput = () => {
    textInputRef.current?.blur();
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableWithoutFeedback onPress={blurInput}>
        <View style={styles.innerContainer}>
          <Text>{question}</Text>
          <LocationInput
            location={location}
            text={address}
            onChangeText={text => {
              setAddressLocation(null);
              setAddress(text);
            }}
            onSelectLocation={location => {
              setAddressLocation(location);
              setAddress(location.label);
            }}
            textInputRef={textInputRef}
            label={label}
            placeholder={placeholder}
            style={styles.textInput}
          />
        </View>
      </TouchableWithoutFeedback>
      <View
        style={{
          width: '100%',
          position: 'absolute',
          bottom: 0,
          padding: 24,
          shadowOffset: {width: 5, height: 5},
          shadowOpacity: 0.75,
          shadowRadius: 10,
          shadowColor: colors.general.black,
        }}
      >
        <TouchableOpacity
          style={styles.button}
          onPress={() => addressLocation && onLocationSelect(addressLocation)}
        >
          <Text style={styles.buttonText}>{buttonText}</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.primary.green,
    flex: 1,
  },
  innerContainer: {
    flex: 1,
    padding: 24,
    paddingTop: 96,
  },
  textInput: {
    paddingBottom: 24,
  },
  button: {
    backgroundColor: colors.primary.gray,
    width: '100%',
    height: 46,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 17,
    color: colors.general.white,
  },
});
