import React, {useState, useRef} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TouchableWithoutFeedback,
  TextInput,
} from 'react-native';
import colors from '../../assets/colors';
import Suggestions from './Suggestions';
import LocationInput, {Location} from './LocationInput';
import {useGeolocation} from '../../useGeolocation';

const Form = () => {
  const [homeAddress, setHomeAddress] = useState<string>('');
  const [homeLocation, setHomeLocation] = useState<Location | null>(null);
  const [workAddress, setWorkAddress] = useState<string>('Prinsens gate 39');
  const [workLocation, setWorkLocation] = useState<Location | null>(null);
  const location = useGeolocation();

  const homeTextInputRef = useRef<TextInput>(null);
  const workTextInputRef = useRef<TextInput>(null);
  const blurInputs = () => {
    homeTextInputRef.current?.blur();
    workTextInputRef.current?.blur();
  };

  return (
    <SafeAreaView style={styles.container}>
      <TouchableWithoutFeedback onPress={blurInputs}>
        <View style={styles.innerContainer}>
          <LocationInput
            location={location}
            text={homeAddress}
            onChangeText={text => {
              setHomeLocation(null);
              setHomeAddress(text);
            }}
            onSelectLocation={location => {
              setHomeLocation(location);
              setHomeAddress(location.label);
            }}
            textInputRef={homeTextInputRef}
            label="1. Hjemmeadresse"
            placeholder="Legg til hjemmeadresse"
            style={styles.textInput}
          />
          <LocationInput
            location={location}
            text={workAddress}
            onChangeText={text => {
              setWorkLocation(null);
              setWorkAddress(text);
            }}
            onSelectLocation={location => {
              setWorkLocation(location);
              setWorkAddress(location.label);
            }}
            textInputRef={workTextInputRef}
            label="2. Jobbadresse"
            placeholder="Legg til jobbeadresse"
          />
        </View>
      </TouchableWithoutFeedback>
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
});

export default Form;
