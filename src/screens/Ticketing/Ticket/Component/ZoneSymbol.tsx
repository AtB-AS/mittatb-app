import {StyleSheet, useTheme} from '@atb/theme';
import {useTranslation} from '@atb/translations';
import {flatStaticColors, getStaticColor, StaticColor} from '@atb/theme/colors';
import {View} from 'react-native';
import ThemeText from '@atb/components/text';
import {getReferenceDataName} from '@atb/reference-data/utils';
import React from 'react';
import {TicketInfoDetailsProps} from '@atb/screens/Ticketing/Ticket/TicketInfo';
import ThemeIcon from '@atb/components/theme-icon';
import {Bus} from '@atb/assets/svg/mono-icons/transportation';

const ZoneSymbol = ({
  fromTariffZone,
  toTariffZone,
  preassignedFareProduct,
}: TicketInfoDetailsProps) => {
  const styles = useStyles();
  const {themeName} = useTheme();
  const {language} = useTranslation();
  if (!fromTariffZone || !toTariffZone) return null;
  const themeColor: StaticColor | undefined =
    preassignedFareProduct?.type === 'period' ||
    preassignedFareProduct?.type === 'hour24'
      ? 'valid'
      : undefined;
  const fillColor = getStaticColor(
    themeName,
    themeColor || 'background_3',
  ).text;

  return (
    <View
      style={[
        styles.symbolContainer,
        {
          backgroundColor: themeColor
            ? flatStaticColors[themeName][themeColor].background
            : undefined,
        },
      ]}
    >
      <ThemeText
        type="body__primary--bold"
        allowFontScaling={false}
        style={styles.symbolZones}
        color={themeColor}
      >
        {getReferenceDataName(fromTariffZone, language)}
        {fromTariffZone.id !== toTariffZone.id &&
          '-' + getReferenceDataName(toTariffZone, language)}
      </ThemeText>
      <ThemeIcon svg={Bus} fill={fillColor} size={'large'} />
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  symbolContainer: {
    height: 72,
    width: 72,
    justifyContent: 'center',
    alignItems: 'center',
    alignSelf: 'center',
    borderRadius: 1000,
    borderColor: theme.static.status.valid.background,
    borderWidth: 5,
  },
  symbolZones: {
    marginTop: theme.spacings.small,
  },
}));

export default ZoneSymbol;
