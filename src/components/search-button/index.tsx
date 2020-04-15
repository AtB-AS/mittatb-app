import React from 'react';
import {View, Text} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';

import {Location} from '../../favorites/types';
import {StyleSheet} from '../../theme';

type ResultItemProps = {
  title: string;
  placeholder: string;
  onPress: () => void;
  location?: Location;
  icon?: JSX.Element;
};

const SearchButton: React.FC<ResultItemProps> = ({
  title,
  placeholder,
  location,
  icon,
  onPress,
}) => {
  const styles = useThemeStyles();

  return (
    <View style={styles.buttonContainer}>
      <Text style={styles.title}>{title}</Text>
      <TouchableOpacity style={styles.button} onPress={onPress}>
        {icon}
        <Text style={styles.buttonText}>{location?.label ?? placeholder}</Text>
      </TouchableOpacity>
    </View>
  );
};

export default SearchButton;

const useThemeStyles = StyleSheet.createThemeHook((theme) => ({
  buttonContainer: {
    flexDirection: 'column',
    alignItems: 'center',
    width: '100%',
    marginVertical: 20,
  },
  title: {marginVertical: 4},
  button: {
    height: 44,
    borderRadius: 4,
    borderTopLeftRadius: 16,
    backgroundColor: theme.background.secondary,
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 24,
  },
  buttonText: {
    marginLeft: 12,
    fontSize: 16,
    fontWeight: '600',
  },
}));
