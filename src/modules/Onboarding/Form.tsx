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
  const [workAddress, setWorkAddress] = useState<string>('');
  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.innerContainer}>
        <Text style={styles.label}>1. Hjemmeadresse</Text>
        <TextInput
          style={styles.textInput}
          value={homeAddress}
          onChangeText={setHomeAddress}
          placeholder="Legg til hjemmeadresse"
        />
        <View>
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
        </View>
        <Text style={[styles.label, {opacity: homeAddress ? 1 : 0.4}]}>
          2. Jobbadresse
        </Text>
        <TextInput
          style={styles.textInput}
          value={workAddress}
          onChangeText={setWorkAddress}
          placeholder="Legg til jobbadresse"
        />
        <View>
          <Suggestions
            style={{backgroundColor: 'white'}}
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
            renderItem={({item}: {item: string}) => (
              <TouchableOpacity key={item} onPress={() => setWorkAddress(item)}>
                <Text>{item}</Text>
              </TouchableOpacity>
            )}
          />
        </View>
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
  },
});

export default Form;
