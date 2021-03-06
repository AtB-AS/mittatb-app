import React from 'react';
import {AccessibilityProps, ActivityIndicator} from 'react-native';
import {LocationWithMetadata} from '@atb/favorites/types';
import {useTheme} from '@atb/theme';
import {screenReaderPause} from '@atb/components/accessible-text';
import ButtonInput, {ButtonInputProps} from './button-input';
import {SectionTexts} from '@atb/translations';
import {useTranslation} from '@atb/translations';

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
  const {t} = useTranslation();

  const {theme} = useTheme();
  const currentValueLabel =
    location?.resultType == 'geolocation'
      ? t(SectionTexts.locationInput.myPosition)
      : location?.label;

  if (currentValueLabel) {
    props.accessibilityValue = {
      text:
        t(SectionTexts.locationInput.a11yValue(currentValueLabel)) +
        screenReaderPause,
    };
  }

  return (
    <ButtonInput
      accessible={true}
      accessibilityRole="button"
      value={currentValueLabel}
      placeholder={
        updatingLocation
          ? t(SectionTexts.locationInput.updatingLocation)
          : t(SectionTexts.locationInput.placeholder)
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
