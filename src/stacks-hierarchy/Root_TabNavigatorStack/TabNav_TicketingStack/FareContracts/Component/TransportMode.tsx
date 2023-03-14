import {View} from 'react-native';
import {TransportationIcon} from '@atb/components/transportation-icon';
import {ThemeText} from '@atb/components/text';
import {FareContractTexts, useTranslation} from '@atb/translations';
import React from 'react';
import {StyleSheet, Theme} from '@atb/theme';
import {TransportModeType} from '@atb/configuration/types';

export const TransportMode = ({
  modes,
  iconSize,
  disabled,
}: {
  modes: TransportModeType[];
  iconSize?: keyof Theme['icon']['size'];
  disabled?: boolean;
}) => {
  const styles = useStyles();
  const {t} = useTranslation();
  const modesDisplayLimit: number = 2;
  const modesCount: number = modes.length;
  const modesToDisplay = modes.slice(0, modesDisplayLimit);
  return (
    <View style={styles.transportationMode}>
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
        <View style={styles.multipleModes}>
          <ThemeText
            style={styles.fonts}
            color={'transport_other'}
            testID={'amountAdditionalModes'}
          >
            +{modesCount - 2}
          </ThemeText>
        </View>
      )}
      <ThemeText type="label__uppercase" color={'secondary'}>
        {modesCount <= modesDisplayLimit
          ? modes
              .map((tm) => t(FareContractTexts.transportMode(tm.mode)))
              .join('/')
          : t(FareContractTexts.multipleTravelModes)}
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
  fonts: {
    fontSize: 12,
  },
  multipleModes: {
    marginRight: theme.spacings.xSmall,

    paddingHorizontal: theme.spacings.xSmall,
    borderRadius: theme.border.radius.small,
    backgroundColor: theme.static.transport.transport_other.background,
  },
}));
