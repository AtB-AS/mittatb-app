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
import {LocationWithMetadata} from '../../favorites/types';
import {screenReaderPause} from '../accessible-text';

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
  return (
    <View style={style}>
      <TouchableOpacity
        {...accessiblityProps}
        style={styles.button}
        onPress={onPress}
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
  location?: LocationWithMetadata;
} & AccessibilityProps;

export const LocationButton: React.FC<LocationButtonProps> = ({
  location,
  ...props
}) => {
  const currentValueLabel =
    location?.resultType == 'geolocation' ? 'Min posisjon' : location?.label;

  if (currentValueLabel) {
    props.accessibilityValue = {
      text: currentValueLabel + ' er valgt.' + screenReaderPause,
    };
  }
  return <SearchButton text={currentValueLabel} {...props} />;
};

const useThemeStyles = StyleSheet.createThemeHook((theme) => ({
  button: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 12,
    paddingVertical: 8,
  },
  buttonContainer: {
    flexDirection: 'row',
  },
  title: {width: 40},
  buttonText: {
    fontSize: 16,
    lineHeight: 20,
    flex: 1,
    marginLeft: 20,
  },
  icon: {
    position: 'absolute',
    left: 46,
  },
}));
