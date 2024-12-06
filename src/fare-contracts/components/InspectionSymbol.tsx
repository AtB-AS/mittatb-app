import {StyleSheet, useTheme} from '@atb/theme';
import {FareContractTexts, useTranslation} from '@atb/translations';
import {ActivityIndicator, View} from 'react-native';
import {ThemeText} from '@atb/components/text';
import React from 'react';
import {ThemeIcon} from '@atb/components/theme-icon';
import {
  PreassignedFareProduct,
  ProductTypeTransportModes,
  TariffZone,
  useFirestoreConfiguration,
} from '@atb/configuration';
import {Moon, Youth} from '@atb/assets/svg/mono-icons/ticketing';
import {useThemeColorForTransportMode} from '@atb/utils/use-transportation-color';
import {ContrastColor} from '@atb/theme/colors';
import {useMobileTokenContextState} from '@atb/mobile-token';
import {getTransportModeSvg} from '@atb/components/icon-box';
import {SvgProps} from 'react-native-svg';

export type InspectionSymbolProps = {
  preassignedFareProduct?: PreassignedFareProduct;
  sentTicket?: boolean;
};

export const InspectionSymbol = ({
  preassignedFareProduct,
  sentTicket,
}: InspectionSymbolProps) => {
  const styles = useStyles();
  const {theme} = useTheme();

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
    ? theme.color.transport[transportColor].primary
    : theme.color.status['warning'].primary;

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
          themeColor={themeColor}
        />
      ) : (
        <NotInspectableContent />
      )}
    </View>
  );
};

const InspectableContent = ({
  preassignedFareProduct,
  themeColor,
}: {
  preassignedFareProduct?: PreassignedFareProduct;
  fromTariffZone?: TariffZone;
  toTariffZone?: TariffZone;
  themeColor: ContrastColor;
}) => {
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

  return (
    <View
      style={[
        styles.symbolContent,
        {
          backgroundColor: shouldFill ? themeColor.background : undefined,
        },
      ]}
    >
      <ThemeIcon
        svg={InspectionSvg}
        color={shouldFill ? themeColor : undefined}
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
    borderColor: theme.color.status.warning.primary.background,
    borderWidth: 2,
  },
  symbolContent: {
    height: '100%',
    width: '100%',
    padding: theme.spacing.small,
    justifyContent: 'center',
    alignItems: 'center',
  },
}));
