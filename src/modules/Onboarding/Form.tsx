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
import Input from './Input';
import Suggestions from './Suggestions';

const Form = () => {
  const [homeAddress, setHomeAddress] = useState<string>('');
  const [workAddress, setWorkAddress] = useState<string>('');
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.innerContainer}>
        <Text style={styles.label}>1. Hjemmeadresse</Text>
        <TextInput
          style={styles.textInput}
          value={homeAddress}
          onChangeText={setHomeAddress}
        />
        <Suggestions
          style={{backgroundColor: 'white'}}
          suggestions={
            homeAddress.length > 2
              ? [
                  'Prinsens gate 39',
                  'Sirkus shopping',
                  'Rush trampolinepark',
                  'Munkholmen',
                ]
              : []
          }
          renderItem={({item}: {item: string}) => (
            <TouchableOpacity key={item} onPress={() => setHomeAddress(item)}>
              <Text>{item}</Text>
            </TouchableOpacity>
          )}
        />
        <Text style={[styles.label, {opacity: homeAddress ? 1 : 0.4}]}>
          2. Jobbadresse
        </Text>
        <Input
          style={[styles.textInput, {opacity: homeAddress ? 1 : 0.4}]}
          query={workAddress}
          setQuery={setWorkAddress}
          suggestions={
            workAddress.length > 2
              ? [
                  'Prinsens gate 39',
                  'Sirkus shopping',
                  'Rush trampolinepark',
                  'Munkholmen',
                ]
              : []
          }
          selectSuggestion={setWorkAddress}
        />
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
    marginBottom: 24,
    zIndex: 1,
    width: 200,
    backgroundColor: 'white',
  },
});

export default Form;
