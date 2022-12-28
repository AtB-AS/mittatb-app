import React from 'react';
import {AccessibilityProps, ActivityIndicator} from 'react-native';
import {Location} from '@atb/favorites/types';
import {useTheme} from '@atb/theme';
import {screenReaderPause} from '@atb/components/text';
import ButtonInput, {ButtonInputProps} from './button-input';
import {SectionTexts} from '@atb/translations';
import {useTranslation} from '@atb/translations';

type LocationInputProps = Omit<ButtonInputProps, 'value'> & {
  location?: Location;
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
  } else {
    props.accessibilityValue = {text: ''}; // this must be reset or TB will announce previous result
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
      testID="searchFromButton"
      {...props}
    />
  );
}
