import {StyleSheet, useTheme} from '@atb/theme';
import {TicketTexts, useTranslation} from '@atb/translations';
import {View} from 'react-native';
import ThemeText from '@atb/components/text';
import React from 'react';
import {getReferenceDataName} from '@atb/reference-data/utils';
import ThemeIcon from '@atb/components/theme-icon';
import {Bus} from '@atb/assets/svg/mono-icons/transportation';
import {PreassignedFareProduct, TariffZone} from '@atb/reference-data/types';
import {ContrastColor} from '@atb-as/theme';

export type InspectionSymbolProps = {
  preassignedFareProduct?: PreassignedFareProduct;
  fromTariffZone?: TariffZone;
  toTariffZone?: TariffZone;
  isInspectable?: boolean;
};

const InspectionSymbol = ({
  preassignedFareProduct,
  fromTariffZone,
  toTariffZone,
  isInspectable,
}: InspectionSymbolProps) => {
  const styles = useStyles();
  const {theme} = useTheme();
  const themeColor = isInspectable
    ? theme.static.status['valid']
    : theme.static.status['warning'];

  return (
    <View
      style={[styles.symbolContainer, {borderColor: themeColor.background}]}
    >
      {isInspectable ? (
        <InspectableContent
          preassignedFareProduct={preassignedFareProduct}
          fromTariffZone={fromTariffZone}
          toTariffZone={toTariffZone}
          themeColor={themeColor}
        />
      ) : (
        <NotInspectableContent />
      )}
    </View>
  );
};

const InspectableContent = ({
  fromTariffZone,
  toTariffZone,
  preassignedFareProduct,
  themeColor,
}: {
  preassignedFareProduct?: PreassignedFareProduct;
  fromTariffZone?: TariffZone;
  toTariffZone?: TariffZone;
  themeColor: ContrastColor;
}) => {
  const {language} = useTranslation();
  const styles = useStyles();
  if (!fromTariffZone || !toTariffZone) return null;
  const shouldFill =
    preassignedFareProduct?.type === 'period' ||
    preassignedFareProduct?.type === 'hour24';

  return (
    <View
      style={[
        styles.symbolContent,
        {
          backgroundColor: shouldFill ? themeColor.background : undefined,
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
      <ThemeIcon
        svg={Bus}
        fill={shouldFill ? themeColor.text : undefined}
        size={'large'}
      />
    </View>
  );
};

const NotInspectableContent = () => {
  const {t} = useTranslation();
  const styles = useStyles();
  return (
    <View style={styles.symbolContent}>
      <ThemeText
        type="body__tertiary"
        style={{
          textAlign: 'center',
        }}
        accessibilityLabel={t(TicketTexts.ticketInfo.noInspectionIconA11yLabel)}
      >
        {t(TicketTexts.ticketInfo.noInspectionIcon)}
      </ThemeText>
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  symbolContainer: {
    minHeight: 72,
    minWidth: 72,
    aspectRatio: 1,
    overflow: 'hidden',
    alignSelf: 'center',
    borderRadius: 1000,
    borderColor: theme.static.status.warning.background,
    borderWidth: 5,
  },
  symbolContent: {
    height: '100%',
    width: '100%',
    padding: theme.spacings.small,
    justifyContent: 'center',
    alignItems: 'center',
  },
  symbolZones: {
    marginTop: theme.spacings.small,
  },
}));

export default InspectionSymbol;
