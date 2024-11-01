import React from 'react';
import {AccessibilityProps, ActivityIndicator} from 'react-native';
import {Location} from '@atb/favorites';
import {useTheme} from '@atb/theme';
import {screenReaderPause} from '@atb/components/text';
import {ButtonSectionItem, ButtonSectionItemProps} from './ButtonSectionItem';
import {SectionTexts} from '@atb/translations';
import {useTranslation} from '@atb/translations';

type Props = Omit<ButtonSectionItemProps, 'value'> & {
  location?: Location;
  updatingLocation?: boolean;
} & AccessibilityProps;

export function LocationInputSectionItem({
  location,
  updatingLocation,
  icon: inputIcon,
  onIconPress,
  ...props
}: Props) {
  const {t} = useTranslation();

  const {theme} = useTheme();
  const currentValueLabel =
    location?.resultType == 'geolocation'
      ? t(SectionTexts.LocationInputSectionItem.myPosition)
      : location?.label;

  if (currentValueLabel) {
    props.accessibilityValue = {
      text:
        t(SectionTexts.LocationInputSectionItem.a11yValue(currentValueLabel)) +
        screenReaderPause,
    };
  } else {
    props.accessibilityValue = {text: ''}; // this must be reset or TB will announce previous result
  }

  return (
    <ButtonSectionItem
      accessible={true}
      accessibilityRole="button"
      value={currentValueLabel}
      placeholder={
        updatingLocation
          ? t(SectionTexts.LocationInputSectionItem.updatingLocation)
          : t(SectionTexts.LocationInputSectionItem.placeholder)
      }
      icon={
        updatingLocation ? (
          <ActivityIndicator color={theme.color.foreground.dynamic.primary} />
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
