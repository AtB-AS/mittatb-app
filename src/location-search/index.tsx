import React from 'react';
import {Text, View} from 'react-native';
import {TextInput} from 'react-native-gesture-handler';
import {StyleSheet} from '../theme';

const LocationSearch: React.FC = () => {
  const styles = useThemeStyles();
  return (
    <View style={styles.container}>
      <Text>Adresse eller stoppested</Text>
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
    </View>
  );
};

const useThemeStyles = StyleSheet.createThemeHook(theme => ({
  container: {
    backgroundColor: theme.background.primary,
    flex: 1,
    padding: 24,
  },
  textInputContainer: {
    width: '100%',
    height: 46,
    flexDirection: 'row',
  },
  textInput: {
    backgroundColor: theme.background.primary,
    borderBottomColor: theme.border.primary,
    color: theme.text.primary,
    borderBottomWidth: 2,
    borderRadius: 4,
    padding: 12,
    fontSize: 16,

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
}));

export default LocationSearch;
