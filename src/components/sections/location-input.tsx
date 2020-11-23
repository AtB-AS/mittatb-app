import React, {forwardRef} from 'react';
import {
  AccessibilityProps,
  ActivityIndicator,
  TouchableOpacity,
} from 'react-native';
import {LocationWithMetadata} from '../../favorites/types';
import {useTheme} from '../../theme';
import {screenReaderPause} from '../accessible-text';
import ButtonInput, {ButtonInputProps} from './button-input';

type LocationInputProps = Omit<ButtonInputProps, 'value'> & {
  location?: LocationWithMetadata;
  updatingLocation?: boolean;
} & AccessibilityProps;

const LocationInput = forwardRef<TouchableOpacity, LocationInputProps>(
  (
    {location, updatingLocation, icon: inputIcon, onIconPress, ...props},
    ref,
  ) => {
    const {theme} = useTheme();
    const currentValueLabel =
      location?.resultType == 'geolocation' ? 'Min posisjon' : location?.label;

    if (currentValueLabel) {
      props.accessibilityValue = {
        text: currentValueLabel + ' er valgt.' + screenReaderPause,
      };
    }

    return (
      <ButtonInput
        accessible={true}
        ref={ref}
        accessibilityRole="button"
        value={currentValueLabel}
        placeholder={
          updatingLocation
            ? 'Oppdater posisjon'
            : 'Søk etter adresse eller sted'
        }
        icon={
          updatingLocation ? (
            <ActivityIndicator color={theme.text.colors.primary} />
          ) : (
            inputIcon
          )
        }
        onIconPress={updatingLocation ? undefined : onIconPress}
        {...props}
      />
    );
  },
);
export default LocationInput;
