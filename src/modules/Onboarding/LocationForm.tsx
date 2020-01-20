import React, {useState, useRef} from 'react';
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

type Props = {
  question: string;
  label: string;
  placeholder: string;
  buttonText: string;
  onLocationSelect: (location: Location) => void;
};

const Form: React.FC<Props> = ({
  question,
  label,
  placeholder,
  buttonText,
  onLocationSelect,
}) => {
  const [address, setAddress] = useState<string>('');
  const [addressLocation, setAddressLocation] = useState<Location | null>(null);
  const location = useGeolocation();

  const homeTextInputRef = useRef<TextInput>(null);
  const blurInput = () => {
    homeTextInputRef.current?.blur();
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
            textInputRef={homeTextInputRef}
            label={label}
            placeholder={placeholder}
            style={styles.textInput}
          />
        </View>
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
  button: {
    backgroundColor: colors.primary.green,
    width: '100%',
    height: 46,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    fontSize: 17,
  },
});

export default Form;
