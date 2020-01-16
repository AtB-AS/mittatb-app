import React, {useState} from 'react';
import {
  SafeAreaView,
  StyleSheet,
  Text,
  View,
  TouchableOpacity,
  TextInput,
} from 'react-native';
import colors from '../../assets/colors';
import Suggestions from './Suggestions';

const Form = () => {
  const [homeAddress, setHomeAddress] = useState<string>('');
  const [workAddress, setWorkAddress] = useState<string>('Prinsens gate 39');
  const [focusedInput, setFocusedInput] = useState<string | null>(null);

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.innerContainer}>
        <Text style={styles.label}>1. Hjemmeadresse</Text>
        <TextInput
          style={styles.textInput}
          value={homeAddress}
          onChangeText={setHomeAddress}
          placeholder="Legg til hjemmeadresse"
          onFocus={() => setFocusedInput('home')}
        />
        {focusedInput === 'home' ? (
          <View style={{zIndex: 10}}>
            <Suggestions
              style={{backgroundColor: 'white'}}
              suggestions={
                homeAddress.length > 2
                  ? ['Prinsens gate 39', 'Sirkus shopping']
                  : []
              }
              renderItem={({item}: {item: string}) => (
                <TouchableOpacity
                  style={{padding: 12}}
                  key={item}
                  onPress={() => {
                    setHomeAddress(item);
                    setFocusedInput(null);
                  }}>
                  <Text style={{fontSize: 20}}>{item}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        ) : null}
        <Text
          style={[
            styles.label,
            {marginTop: 24, opacity: homeAddress ? 1 : 0.4},
          ]}>
          2. Jobbadresse
        </Text>
        <TextInput
          style={styles.textInput}
          value={workAddress}
          onChangeText={setWorkAddress}
          placeholder="Legg til jobbadresse"
          onFocus={() => setFocusedInput('work')}
        />
        {focusedInput === 'work' ? (
          <View style={{zIndex: 10}}>
            <Suggestions
              style={{backgroundColor: 'white'}}
              suggestions={workAddress.length > 2 ? ['Prinsens gate 39'] : []}
              renderItem={({item}: {item: string}) => (
                <TouchableOpacity
                  style={{padding: 12}}
                  key={item}
                  onPress={() => {
                    setWorkAddress(item);
                    setFocusedInput(null);
                  }}>
                  <Text style={{fontSize: 20}}>{item}</Text>
                </TouchableOpacity>
              )}
            />
          </View>
        ) : null}
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    backgroundColor: colors.gray,
    flex: 1,
  },
  innerContainer: {
    flex: 1,
    padding: 24,
  },
  label: {
    color: 'white',
    fontSize: 20,
    marginBottom: 12,
  },
  textInput: {
    width: '100%',
    height: 46,
    fontSize: 20,
    paddingLeft: 12,
    backgroundColor: 'white',
    borderBottomColor: colors.blue,
    borderBottomWidth: 2,
  },
});

export default Form;
