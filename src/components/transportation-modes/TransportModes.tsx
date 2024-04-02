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
import {TextColor, TextNames} from '@atb-as/theme';
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
  textColor?: TextColor;
  style?: ViewStyle;
  customTransportModeText?: string;
}) => {
  const styles = useStyles();
  const {t} = useTranslation();

  const transportModeText: string = getTransportModeText(
    modes,
    t,
    modesDisplayLimit,
  );

  return (
    <View style={[styles.transportationMode, style]}>
      <TransportationIconBoxList
        modes={modes}
        maxNumberOfBoxes={2}
        iconSize={iconSize}
        disabled={disabled}
      />
      <ThemeText
        type={textType ?? 'label__uppercase'}
        color={textColor ?? 'secondary'}
        accessibilityLabel={t(
          customTransportModeText
            ? FareContractTexts.transportModes.a11yLabelWithCustomText(
                transportModeText,
                customTransportModeText,
              )
            : FareContractTexts.transportModes.a11yLabel(transportModeText),
        )}
      >
        {customTransportModeText ? customTransportModeText : transportModeText}
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
    marginRight: theme.spacings.xSmall,
  },
}));
