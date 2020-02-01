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
import LocationInput from './LocationInput';
import {TouchableHighlight} from 'react-native-gesture-handler';
import {StackNavigationProp} from '@react-navigation/stack';
import {OnboardingStackParamList} from './';
import {GeolocationResponse} from '@react-native-community/geolocation';
import {Location} from '../../AppContext';
import HomeIcon from '../../assets/svg/HomeIcon';
import WorkIcon from '../../assets/svg/WorkIcon';
import {useOnboardingState} from './OnboardingContext';

type Props = {
  location: GeolocationResponse | null;
  prefilledLocation: Location | null;
  icon: JSX.Element;
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
  const context = useOnboardingState();
  return (
    <LocationForm
      key="homeForm"
      prefilledLocation={context?.home ?? null}
      location={context?.location ?? null}
      icon={<HomeIcon width={30} height={30} style={styles.icon} />}
      question="Hvor bor du?"
      label="Hjemmeadresse"
      placeholder="Søk etter adresse"
      buttonText="Neste"
      onLocationSelect={(home: Location) => {
        if (context) {
          context.dispatch({type: 'SET_HOME', home});
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
  const context = useOnboardingState();
  return (
    <LocationForm
      key="workForm"
      prefilledLocation={context?.work ?? null}
      location={context?.location ?? null}
      icon={<WorkIcon width={28} height={28} style={styles.icon} />}
      question="Hvor jobber du?"
      label="Jobbadresse"
      placeholder="Søk etter adresse"
      buttonText="Neste"
      onLocationSelect={(work: Location) => {
        if (context) {
          context.dispatch({type: 'SET_WORK', work});
        }
      }}
      currentStep={2}
      totalSteps={2}
    />
  );
};

const LocationForm: React.FC<Props> = ({
  location,
  prefilledLocation,
  icon,
  question,
  label,
  placeholder,
  buttonText,
  onLocationSelect,
  totalSteps,
  currentStep,
}) => {
  const [address, setAddress] = useState<string>(prefilledLocation?.name ?? '');
  const [addressLocation, setAddressLocation] = useState<Location | null>(
    prefilledLocation,
  );
  const [error, setError] = useState<string | null>(null);

  const textInputRef = useRef<TextInput>(null);
  const blurInput = () => {
    textInputRef.current?.isFocused && textInputRef.current?.blur();
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableWithoutFeedback onPress={blurInput}>
        <View style={styles.innerContainer}>
          <View style={styles.iconQuestionContainer}>
            {icon}
            <Text style={styles.question}>{question}</Text>
          </View>
          <Text style={styles.label}>{label}</Text>
          <LocationInput
            location={location}
            text={address}
            error={error}
            onChangeText={text => {
              setError(null);
              setAddressLocation(null);
              setAddress(text);
            }}
            hintText={addressLocation ? addressLocation.locality : undefined}
            onSelectLocation={location => {
              setError(null);
              setAddressLocation(location);
              setAddress(location.name ?? '');
            }}
            textInputRef={textInputRef}
            placeholder={placeholder}
            style={styles.textInput}
          />
        </View>
      </TouchableWithoutFeedback>
      <View style={styles.bottomContainer}>
        <View style={styles.stepContainer}>
          {[...Array(totalSteps).keys()].map(step => (
            <Text key={step} style={stepStyle(step, currentStep)}>
              ∙
            </Text>
          ))}
        </View>
        <View style={{opacity: addressLocation !== null ? 1 : 0.2}}>
          <TouchableHighlight
            style={[styles.button]}
            onPress={() => {
              if (addressLocation) {
                onLocationSelect(addressLocation);
              } else {
                setError(
                  'Vennligst søk opp og velg en gyldig adresse fra listen.',
                );
              }
            }}
          >
            <Text style={styles.buttonText}>{buttonText}</Text>
          </TouchableHighlight>
        </View>
      </View>
    </SafeAreaView>
  );
};

const stepStyle = (step: number, currentStep: number): TextStyle => ({
  fontSize: 52,
  opacity: step === currentStep - 1 ? 1 : 0.5,
  textAlign: 'center',
  textAlignVertical: 'center',
});
const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.primary.green,
    flex: 1,
    justifyContent: 'space-between',
  },
  innerContainer: {
    flex: 1,
    padding: 24,
    paddingTop: 96,
  },
  iconQuestionContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 24,
  },
  icon: {
    marginRight: 12,
  },
  question: {
    fontSize: 28,
    padding: 0,
    margin: 0,
  },
  label: {
    color: colors.general.black,
    fontSize: 12,
    marginBottom: 12,
  },
  textInput: {
    paddingBottom: 24,
  },
  bottomContainer: {
    padding: 24,
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
