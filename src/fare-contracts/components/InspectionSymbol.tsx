import {StyleSheet, useTheme} from '@atb/theme';
import {FareContractTexts, useTranslation} from '@atb/translations';
import {ActivityIndicator, View} from 'react-native';
import {ThemeText} from '@atb/components/text';
import React from 'react';
import {ThemeIcon} from '@atb/components/theme-icon';
import {
  getReferenceDataName,
  PreassignedFareProduct,
  ProductTypeTransportModes,
  TariffZone,
  useFirestoreConfiguration,
} from '@atb/configuration';
import {Moon, Youth} from '@atb/assets/svg/mono-icons/ticketing';
import {useThemeColorForTransportMode} from '@atb/utils/use-transportation-color';
import {ContrastColor} from '@atb-as/theme';
import {getTransportationColor} from '@atb/theme/colors';
import {useMobileTokenContextState} from '@atb/mobile-token';
import {getTransportModeSvg} from '@atb/components/icon-box';
import {SvgProps} from 'react-native-svg';

export type InspectionSymbolProps = {
  preassignedFareProduct?: PreassignedFareProduct;
  fromTariffZone?: TariffZone;
  toTariffZone?: TariffZone;
  sentTicket?: boolean;
};

export const InspectionSymbol = ({
  preassignedFareProduct,
  fromTariffZone,
  toTariffZone,
  sentTicket,
}: InspectionSymbolProps) => {
  const styles = useStyles();
  const {theme, themeName} = useTheme();

  const {fareProductTypeConfigs} = useFirestoreConfiguration();
  const fareProductTypeConfig = fareProductTypeConfigs.find(
    (c) => c.type === preassignedFareProduct?.type,
  );

  const transportColor = useThemeColorForTransportMode(
    fareProductTypeConfig?.transportModes[0].mode,
    fareProductTypeConfig?.transportModes[0].subMode,
  );

  const {isInspectable, mobileTokenStatus} = useMobileTokenContextState();

  const themeColor = isInspectable
    ? getTransportationColor(themeName, transportColor)
    : theme.status['warning'].primary;

  if (mobileTokenStatus === 'loading') {
    return <ActivityIndicator size="large" />;
  }

  return (
    <View
      style={[styles.symbolContainer, {borderColor: themeColor.background}]}
    >
      {isInspectable && !sentTicket ? (
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

  const {fareProductTypeConfigs} = useFirestoreConfiguration();
  const fareProductTypeConfig = fareProductTypeConfigs.find(
    (c) => c.type === preassignedFareProduct?.type,
  );

  const shouldFill =
    fareProductTypeConfig?.illustration?.includes('period') ||
    fareProductTypeConfig?.illustration === 'hour24' ||
    fareProductTypeConfig?.illustration === 'youth';

  const InspectionSvg = getInspectionSvg(
    fareProductTypeConfig?.illustration,
    fareProductTypeConfig?.transportModes,
  );

  const fromTariffZoneName =
    fromTariffZone && getReferenceDataName(fromTariffZone, language);
  const toTariffZoneName =
    toTariffZone && getReferenceDataName(toTariffZone, language);

  const shouldShowZoneNames =
    fromTariffZoneName &&
    toTariffZoneName &&
    fromTariffZoneName.length < 3 &&
    toTariffZoneName.length < 3;

  return (
    <View
      style={[
        styles.symbolContent,
        {
          backgroundColor: shouldFill ? themeColor.background : undefined,
        },
      ]}
    >
      {shouldShowZoneNames && (
        <ThemeText
          type="body__primary--bold"
          allowFontScaling={false}
          color={shouldFill ? themeColor : undefined}
        >
          {fromTariffZoneName}
          {fromTariffZone.id !== toTariffZone.id && '-' + toTariffZoneName}
        </ThemeText>
      )}
      <ThemeIcon
        svg={InspectionSvg}
        fill={shouldFill ? themeColor.text : undefined}
        size="large"
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

const getInspectionSvg = (
  illustration: string | undefined,
  transportModes: ProductTypeTransportModes[] | undefined,
): ((props: SvgProps) => JSX.Element) => {
  if (illustration === 'night') return Moon;
  if (illustration === 'youth') return Youth;

  return getTransportModeSvg(
    transportModes?.[0].mode,
    transportModes?.[0].subMode,
  ).svg;
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  symbolContainer: {
    minHeight: 72,
    minWidth: 72,
    aspectRatio: 1,
    overflow: 'hidden',
    alignSelf: 'center',
    borderRadius: 1000,
    borderColor: theme.status.warning.primary.background,
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
