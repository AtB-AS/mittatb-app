import {StyleSheet, useTheme} from '@atb/theme';
import {FareContractTexts, useTranslation} from '@atb/translations';
import {ActivityIndicator, View} from 'react-native';
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
  isInspectable: boolean;
  isLoading?: boolean;
};

const InspectionSymbol = ({
  preassignedFareProduct,
  fromTariffZone,
  toTariffZone,
  isInspectable,
  isLoading,
}: InspectionSymbolProps) => {
  const styles = useStyles();
  const {theme} = useTheme();
  const themeColor = isInspectable
    ? theme.static.status['valid']
    : theme.static.status['warning'];

  if (isLoading) {
    return <ActivityIndicator size="large" />;
  }

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
      {fromTariffZone && toTariffZone && (
        <ThemeText
          type="body__primary--bold"
          allowFontScaling={false}
          color={shouldFill ? themeColor : undefined}
        >
          {getReferenceDataName(fromTariffZone, language)}
          {fromTariffZone.id !== toTariffZone.id &&
            '-' + getReferenceDataName(toTariffZone, language)}
        </ThemeText>
      )}
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
        accessibilityLabel={t(
          FareContractTexts.fareContractInfo.noInspectionIconA11yLabel,
        )}
      >
        {t(FareContractTexts.fareContractInfo.noInspectionIcon)}
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
}));

export default InspectionSymbol;
