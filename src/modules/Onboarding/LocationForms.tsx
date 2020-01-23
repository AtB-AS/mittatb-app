import React, {useState, useRef, useContext} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  View,
  Text,
  TouchableWithoutFeedback,
  TextInput,
  TextStyle,
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
  currentStep: number;
  totalSteps: number;
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
      currentStep={1}
      totalSteps={2}
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
        }
      }}
      currentStep={2}
      totalSteps={2}
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
  totalSteps,
  currentStep,
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
          <Text style={styles.question}>{question}</Text>
          <Text style={styles.label}>{label}</Text>
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
        <View style={styles.stepContainer}>
          {[...Array(totalSteps).keys()].map(step => (
            <Text key={step} style={stepStyle(step, currentStep)}>
              ∙
            </Text>
          ))}
        </View>
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

const stepStyle = (step: number, currentStep: number): TextStyle => ({
  fontSize: step === currentStep - 1 ? 52 : 42,
  opacity: step === currentStep - 1 ? 1 : 0.5,
  textAlign: 'center',
  textAlignVertical: 'center',
  paddingTop: step === currentStep - 1 ? 0 : 4,
});

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
  question: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  label: {
    color: colors.general.black,
    fontSize: 16,
    marginBottom: 12,
  },
  textInput: {
    paddingBottom: 24,
  },
  stepContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
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
