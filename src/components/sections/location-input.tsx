import React from 'react';
import {AccessibilityProps, ActivityIndicator} from 'react-native';
import {LocationWithMetadata} from '../../favorites/types';
import {useTheme} from '../../theme';
import {screenReaderPause} from '../accessible-text';
import ButtonInput, {ButtonInputProps} from './button-input';

type LocationInputProps = Omit<ButtonInputProps, 'value'> & {
  location?: LocationWithMetadata;
  updatingLocation?: boolean;
} & AccessibilityProps;

export default function LocationInput({
  location,
  updatingLocation,
  icon: inputIcon,
  onIconPress,
  ...props
}: LocationInputProps) {
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
      accessibilityRole="button"
      value={currentValueLabel}
      placeholder={
        updatingLocation ? 'Oppdater posisjon' : 'Søk etter adresse eller sted'
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
}
