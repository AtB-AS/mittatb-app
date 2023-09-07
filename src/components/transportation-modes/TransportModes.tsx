import {TransportModeType, TransportSubmodeType} from '@atb-as/config-specs';
import {
  CounterIconBox,
  TransportationIconBox,
  getTransportModeSvg,
} from '@atb/components/icon-box';
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

const removeDuplicatesByIconNameFilter = (
  val: TransportModePair,
  i: number,
  arr: TransportModePair[],
): boolean =>
  arr
    .map((m) => getTransportModeSvg(m.mode, m.subMode).name)
    .indexOf(getTransportModeSvg(val.mode, val.subMode).name) === i;

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

  const modesCount: number = modes.length;
  const modesToDisplay = modes
    .slice(0, modesDisplayLimit)
    .filter(removeDuplicatesByIconNameFilter);

  const transportModeText: string = getTransportModeText(
    modes,
    t,
    modesDisplayLimit,
  );

  return (
    <View style={[styles.transportationMode, style]}>
      {modesToDisplay.map(({mode, subMode}) => (
        <TransportationIconBox
          style={styles.transportationIcon}
          key={mode + subMode}
          mode={mode}
          subMode={subMode}
          size={iconSize}
          disabled={disabled}
        />
      ))}
      {modesCount > modesDisplayLimit && (
        <CounterIconBox
          count={modesCount - modesDisplayLimit}
          size={'small'}
          accessibilityLabel={t(
            FareContractTexts.transportModes.a11yLabelMultipleTravelModes(
              modesCount,
            ),
          )}
        />
      )}
      <ThemeText
        type={textType ?? 'label__uppercase'}
        color={textColor ?? 'secondary'}
        accessibilityLabel={t(
          FareContractTexts.transportModes.a11yLabel(transportModeText),
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
