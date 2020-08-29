import React from 'react';
import {
  View,
  Text,
  ViewStyle,
  StyleProp,
  AccessibilityProps,
  TouchableOpacity,
} from 'react-native';
import {StyleSheet} from '../../theme';
import insets from '../../utils/insets';
import {LocationWithSearchMetadata} from '../../location-search';

type SearchButtonProps = {
  title: string;
  placeholder?: string;
  onPress: () => void;
  text?: string;
  icon?: JSX.Element;
  style?: StyleProp<ViewStyle>;
} & AccessibilityProps;

const SearchButton: React.FC<SearchButtonProps> = ({
  title,
  placeholder,
  text,
  icon,
  onPress,
  style,
  ...accessiblityProps
}) => {
  const styles = useThemeStyles();

  if (text) {
    accessiblityProps.accessibilityValue = {text: text};
  }
  return (
    <View style={style}>
      <TouchableOpacity
        {...accessiblityProps}
        style={styles.button}
        onPress={onPress}
        hitSlop={insets.symmetric(8, 12)}
      >
        <Text style={styles.title}>{title}</Text>
        <View style={styles.icon}>{icon}</View>
        <Text style={styles.buttonText} numberOfLines={1}>
          {text ?? (
            <Text style={{color: 'rgba(0, 0, 0, 0.6)'}}>{placeholder}</Text>
          )}
        </Text>
      </TouchableOpacity>
    </View>
  );
};

export default SearchButton;

type LocationButtonProps = Omit<SearchButtonProps, 'text'> & {
  location?: LocationWithSearchMetadata;
} & AccessibilityProps;

export const LocationButton: React.FC<LocationButtonProps> = ({
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
    padding: 12,
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
