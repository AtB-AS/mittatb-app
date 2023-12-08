import {Theme} from '@atb/theme';
import {
  FareContractTexts,
  TranslateFunction,
  useTranslation,
} from '@atb/translations';
import React from 'react';
import {ViewStyle} from 'react-native';
import {TextColor, TextNames} from '@atb-as/theme';
import _ from 'lodash';
import {StaticColor} from '@atb/theme/colors';
import {TransportModePair} from './types';
import {TransportModesWithText} from './TransportModesWithText';

const modesDisplayLimit: number = 2;

type Props = {
  modes: TransportModePair[];
  iconSize?: keyof Theme['icon']['size'];
  disabled?: boolean;
  textType?: TextNames;
  textColor?: TextColor | StaticColor;
  style?: ViewStyle;
  customTransportModeText?: string;
};

export const TransportModes = ({
  modes,
  iconSize,
  disabled,
  textType,
  textColor,
  style,
  customTransportModeText,
}: Props) => {
  const {t} = useTranslation();

  const transportModeText = getTransportModeText(modes, t, modesDisplayLimit);

  return (
    <TransportModesWithText
      style={style}
      modes={modes}
      maxModesToDisplay={modesDisplayLimit}
      iconSize={iconSize}
      textColor={textColor}
      textType={textType}
      disabled={disabled}
      text={
        customTransportModeText ? customTransportModeText : transportModeText
      }
      accessibilityLabel={t(
        customTransportModeText
          ? FareContractTexts.transportModes.a11yLabelWithCustomText(
              transportModeText,
              customTransportModeText,
            )
          : FareContractTexts.transportModes.a11yLabel(transportModeText),
      )}
    />
  );
};

const removeDuplicateStringsFilter = (
  val: string,
  i: number,
  arr: string[],
): boolean => arr.indexOf(val) === i;

export const getTransportModeText = (
  modes: TransportModePair[],
  t: TranslateFunction,
  modesDisplayLimit: number = 2,
): string => {
  const modesCount: number = modes.length;

  if (!modes) return '';
  if (modesCount > modesDisplayLimit) {
    return t(FareContractTexts.transportModes.multipleTravelModes);
  }
  return _.capitalize(
    modes
      .map((tm) => t(FareContractTexts.transportMode(tm.mode, tm.subMode)))
      .filter(removeDuplicateStringsFilter)
      .join('/'),
  );
};
