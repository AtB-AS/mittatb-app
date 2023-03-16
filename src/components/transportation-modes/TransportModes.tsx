import {View, ViewStyle} from 'react-native';
import {TransportationIcon} from '@atb/components/transportation-icon';
import {ThemeText} from '@atb/components/text';
import {
  FareContractTexts,
  TranslateFunction,
  useTranslation,
} from '@atb/translations';
import React from 'react';
import {StyleSheet, Theme, useTheme} from '@atb/theme';
import {TransportModeType} from '@atb/configuration/types';
import useFontScale from '@atb/utils/use-font-scale';

const modesDisplayLimit: number = 2;

export const getTransportModeText = (
  modes: TransportModeType[],
  t: TranslateFunction,
  modesDisplayLimit: number = 2,
): string => {
  const modesCount: number = modes.length;

  if (!modes) return '';
  if (modesCount > modesDisplayLimit) {
    return t(FareContractTexts.transportModes.multipleTravelModes);
  }
  return modes
    .map((tm) => t(FareContractTexts.transportMode(tm.mode)))
    .join('/');
};
export const TransportModes = ({
  modes,
  iconSize,
  disabled,
  style,
}: {
  modes: TransportModeType[];
  iconSize?: keyof Theme['icon']['size'];
  disabled?: boolean;
  style?: ViewStyle;
}) => {
  const styles = useStyles();
  const {theme} = useTheme();
  const fontScale = useFontScale();
  const {t} = useTranslation();

  const modesCount: number = modes.length;
  const modesToDisplay = modes.slice(0, modesDisplayLimit);
  const boxHeight = {
    height: theme.icon.size['small'] * fontScale + theme.spacings.xSmall * 2,
  };
  const transportModeText: string = getTransportModeText(
    modes,
    t,
    modesDisplayLimit,
  );

  return (
    <View style={[styles.transportationMode, style]}>
      {modesToDisplay.map(({mode, subMode}) => (
        <TransportationIcon
          style={styles.transportationIcon}
          key={mode + subMode}
          mode={mode}
          subMode={subMode}
          size={iconSize}
          disabled={disabled}
        />
      ))}
      {modesCount > modesDisplayLimit && (
        <View style={[styles.multipleModes, boxHeight]}>
          <ThemeText
            color={'transport_other'}
            type="label__uppercase"
            accessibilityLabel={t(
              FareContractTexts.transportModes.a11yLabelMultipleTravelModes(
                modesCount,
              ),
            )}
          >
            +{modesCount - modesDisplayLimit}
          </ThemeText>
        </View>
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
  multipleModes: {
    marginRight: theme.spacings.xSmall,
    paddingHorizontal: theme.spacings.xSmall,
    borderRadius: theme.border.radius.small,
    backgroundColor: theme.static.transport.transport_other.background,
  },
}));
