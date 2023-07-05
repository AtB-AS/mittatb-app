import {TransportModeType, TransportSubmodeType} from '@atb-as/config-specs';
import {CounterIconBox, TransportationIconBox} from '@atb/components/icon-box';
import {ThemeText} from '@atb/components/text';
import {StyleSheet, Theme} from '@atb/theme';
import {
  FareContractTexts,
  TranslateFunction,
  useTranslation,
} from '@atb/translations';
import React from 'react';
import {View, ViewStyle} from 'react-native';

const modesDisplayLimit: number = 2;

export type TransportModePair = {
  mode: TransportModeType;
  subMode?: TransportSubmodeType;
};

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
  return modes
    .map((tm) => t(FareContractTexts.transportMode(tm.mode, tm.subMode)))
    .join('/');
};
export const TransportModes = ({
  modes,
  iconSize,
  disabled,
  style,
}: {
  modes: TransportModePair[];
  iconSize?: keyof Theme['icon']['size'];
  disabled?: boolean;
  style?: ViewStyle;
}) => {
  const styles = useStyles();
  const {t} = useTranslation();

  const modesCount: number = modes.length;
  const modesToDisplay = modes.slice(0, modesDisplayLimit);
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
        type="label__uppercase"
        color={'secondary'}
        accessibilityLabel={t(
          FareContractTexts.transportModes.a11yLabel(transportModeText),
        )}
      >
        {transportModeText}
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
