import React from 'react';
import {AccessibilityProps} from 'react-native';
import {Location} from '@atb/modules/favorites';
import {useThemeContext} from '@atb/theme';
import {screenReaderPause} from '@atb/components/text';
import {ButtonSectionItem, ButtonSectionItemProps} from './ButtonSectionItem';
import {SectionTexts} from '@atb/translations';
import {useTranslation} from '@atb/translations';
import {Loading} from '@atb/components/loading';

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

  const {theme} = useThemeContext();
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
          <Loading color={theme.color.foreground.dynamic.primary} />
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
