import {TransportModeType, TransportSubmodeType} from '@atb/configuration';
import {ThemeText} from '@atb/components/text';
import {StyleSheet, Theme} from '@atb/theme';
import {
  FareContractTexts,
  TranslateFunction,
  useTranslation,
} from '@atb/translations';
import React from 'react';
import {View, ViewStyle} from 'react-native';
import {TextNames} from '@atb-as/theme';
import { ContrastColor } from '@atb/theme/colors';
import _ from 'lodash';
import {TransportationIconBoxList} from '@atb/components/icon-box';

const modesDisplayLimit: number = 2;

export type TransportModePair = {
  mode: TransportModeType;
  subMode?: TransportSubmodeType;
};

const removeDuplicateStringsFilter = (
  val: string,
  i: number,
  arr: string[],
): boolean => arr.indexOf(val) === i;

export const getTransportModeText = (
  modes: TransportModePair[],
  t: TranslateFunction,
): string => {
  if (!modes) return '';
  return _.capitalize(
    modes
      .map((tm) => t(FareContractTexts.transportMode(tm.mode, tm.subMode)))
      .filter(removeDuplicateStringsFilter)
      .join('/'),
  );
};

export const TransportModes = ({
  modes,
  iconSize,
  disabled,
  textType,
  textColor,
  style,
  customTransportModeText,
}: {
  modes: TransportModePair[];
  iconSize?: keyof Theme['icon']['size'];
  disabled?: boolean;
  textType?: TextNames;
  textColor?: ContrastColor;
  style?: ViewStyle;
  customTransportModeText?: string;
}) => {
  const styles = useStyles();
  const {t} = useTranslation();

  const transportModeText: string = getTransportModeText(modes, t);

  const description =
    modes.length > modesDisplayLimit
      ? t(FareContractTexts.transportModes.more)
      : transportModeText;

  return (
    <View
      style={[styles.transportationMode, style]}
      accessibilityLabel={t(
        customTransportModeText
          ? FareContractTexts.transportModes.a11yLabelWithCustomText(
              transportModeText,
              customTransportModeText,
            )
          : FareContractTexts.transportModes.a11yLabel(transportModeText),
      )}
      accessible={true}
    >
      <TransportationIconBoxList
        modes={modes}
        maxNumberOfBoxes={modesDisplayLimit}
        iconSize={iconSize}
        disabled={disabled}
      />
      <ThemeText
        type={textType ?? 'label__uppercase'}
        color={textColor}
      >
        {customTransportModeText ?? description}
      </ThemeText>
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  transportationMode: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
  },
  transportationIcon: {
    marginRight: theme.spacing.xSmall,
  },
}));
