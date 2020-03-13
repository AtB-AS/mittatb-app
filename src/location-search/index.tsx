import React, {useState} from 'react';
import {Text, View, TextStyle} from 'react-native';
import {TextInput} from 'react-native-gesture-handler';
import {StyleSheet} from '../theme';
import InputSearchIcon from './svg/InputSearchIcon';

const LocationSearch: React.FC = () => {
  const styles = useThemeStyles();
  const [text, setText] = useState<string>('');
  return (
    <View style={styles.container}>
      <Text style={styles.label}>Adresse eller stoppested</Text>
      <View style={styles.textInputContainer}>
        <TextInput
          style={styles.textInput}
          value={text}
          onChangeText={setText}
          placeholder="Søk etter adresse eller stoppested"
          autoCorrect={false}
          autoCompleteType="off"
          placeholderTextColor={(styles.placeholder as TextStyle).color}
        />
        <InputSearchIcon style={styles.searchIcon} />
      </View>
    </View>
  );
};

const useThemeStyles = StyleSheet.createThemeHook(theme => ({
  container: {
    backgroundColor: theme.background.secondary,
    flex: 1,
    padding: 24,
  },
  label: {
    fontSize: 12,
    marginBottom: 8,
  },
  placeholder: {
    color: theme.text.faded,
  },
  textInputContainer: {
    width: '100%',
    height: 46,
    flexDirection: 'row',
  },
  textInput: {
    // backgroundColor: theme.background.primary,
    // borderBottomColor: theme.border.primary,
    // color: theme.text.primary,
    // borderBottomWidth: 2,
    // borderRadius: 4,
    // padding: 12,
    // fontSize: 16,

    flex: 1,
    fontSize: 16,
    paddingLeft: 44,
    backgroundColor: theme.background.primary,
    borderBottomWidth: 2,
    borderRadius: 4,
    borderBottomColor: theme.border.primary,
    color: theme.text.primary,
  },
  searchIcon: {
    position: 'absolute',
    left: 14,
    alignSelf: 'center',
  },
}));

export default LocationSearch;
