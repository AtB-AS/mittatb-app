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
  text?: string;
  icon?: JSX.Element;
  style?: StyleProp<ViewStyle>;
};

const SearchButton: React.FC<ResultItemProps> = ({
  title,
  placeholder,
  text,
  icon,
  onPress,
  style,
}) => {
  const styles = useThemeStyles();

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

type ResultItemLocationProps = Omit<ResultItemProps, 'text'> & {
  location?: LocationWithSearchMetadata;
};

export const LocationButton: React.FC<ResultItemLocationProps> = ({
  location,
  ...props
}) => {
  const text =
    location?.resultType == 'geolocation' ? 'Min posisjon' : location?.label;
  return <SearchButton text={text} {...props} />;
};

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
    marginLeft: 6,
    marginRight: 14,
  },
}));
