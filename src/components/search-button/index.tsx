import React from 'react';
import {View, Text, ViewStyle, StyleProp} from 'react-native';
import {TouchableOpacity} from 'react-native-gesture-handler';
import {StyleSheet} from '../../theme';
import insets from '../../utils/insets';
import {LocationWithSearchMetadata} from '../../location-search';

type ResultItemProps = {
  title: string;
  placeholder: string;
  onPress: () => void;
  location?: LocationWithSearchMetadata;
  icon?: JSX.Element;
  style?: StyleProp<ViewStyle>;
};

const SearchButton: React.FC<ResultItemProps> = ({
  title,
  placeholder,
  location,
  icon,
  onPress,
  style,
}) => {
  const styles = useThemeStyles();

  const text =
    location?.resultType == 'geolocation'
      ? 'Min posisjonMin posisjonMin posisjonMin posisjon'
      : location?.label;

  return (
    <View style={style}>
      <TouchableOpacity
        style={styles.button}
        onPress={onPress}
        hitSlop={insets.symmetric(8, 12)}
      >
        <Text style={styles.title}>{title}</Text>
        <View style={styles.icon}>{icon}</View>
        <Text style={styles.buttonText} numberOfLines={1}>
          {text ?? placeholder}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default SearchButton;

const useThemeStyles = StyleSheet.createThemeHook((theme) => ({
  button: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  buttonContainer: {
    flexDirection: 'row',
  },
  title: {width: 40},
  buttonText: {
    fontSize: 16,
    lineHeight: 20,
    flex: 1,
  },
  icon: {
    marginLeft: 12,
  },
}));
