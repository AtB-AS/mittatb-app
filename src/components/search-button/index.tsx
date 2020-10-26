import React from 'react';
import {
  View,
  ViewStyle,
  StyleProp,
  AccessibilityProps,
  TouchableOpacity,
} from 'react-native';
import {StyleSheet} from '../../theme';
import {LocationWithMetadata} from '../../favorites/types';
import {screenreaderPause} from '../accessible-text';
import Text from '../text';

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
          {text ?? <Text style={styles.placeholder}>{placeholder}</Text>}
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
      text: currentValueLabel + ' er valgt.' + screenreaderPause,
    };
  }
  return <SearchButton text={currentValueLabel} {...props} />;
};

const useThemeStyles = StyleSheet.createThemeHook((theme) => ({
  button: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: theme.spacings.medium,
    paddingVertical: theme.spacings.small,
  },
  buttonContainer: {
    flexDirection: 'row',
  },
  title: {width: 40},
  buttonText: {
    fontSize: theme.text.sizes.body,
    lineHeight: 20,
    flex: 1,
    marginLeft: theme.spacings.large,
  },
  icon: {
    position: 'absolute',
    left: 46,
  },
  placeholder: {
    color: theme.text.colors.faded,
  },
}));
