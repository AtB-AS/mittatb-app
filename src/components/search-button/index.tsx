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
    <TouchableOpacity style={styles.button} onPress={onPress}>
      <Text style={styles.title}>{title}</Text>
      <Text style={styles.buttonText}>{location?.label ?? placeholder}</Text>
      <View style={styles.icon}>{icon}</View>
    </TouchableOpacity>
  );
};

export default SearchButton;

const useThemeStyles = StyleSheet.createThemeHook((theme) => ({
  button: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingVertical: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
  },
  title: {width: 30},
  buttonText: {
    marginLeft: 12,
    fontSize: 16,
    flex: 1,
  },
  icon: {},
}));
