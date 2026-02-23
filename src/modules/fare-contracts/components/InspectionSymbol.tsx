import {StyleSheet, useThemeContext} from '@atb/theme';
import {FareContractTexts, useTranslation} from '@atb/translations';
import {View} from 'react-native';
import {ThemeText} from '@atb/components/text';
import React from 'react';
import {ThemeIcon} from '@atb/components/theme-icon';
import {
  PreassignedFareProduct,
  ProductTypeTransportModes,
  useFirestoreConfigurationContext,
} from '@atb/modules/configuration';
import {Moon, Student, Youth} from '@atb/assets/svg/mono-icons/ticketing';
import {useMobileTokenContext} from '@atb/modules/mobile-token';
import {getTransportModeSvg} from '@atb/components/icon-box';
import {SvgProps} from 'react-native-svg';
import {useFareProductColor} from '../use-fare-product-color';
import {Loading} from '@atb/components/loading';

export type InspectionSymbolProps = {
  preassignedFareProduct?: PreassignedFareProduct;
  sentTicket?: boolean;
};

export const InspectionSymbol = ({
  preassignedFareProduct,
  sentTicket,
}: InspectionSymbolProps) => {
  const {isInspectable, mobileTokenStatus} = useMobileTokenContext();

  if (mobileTokenStatus === 'loading') {
    return <Loading size="large" />;
  }

  return isInspectable && !sentTicket ? (
    <InspectableContent preassignedFareProduct={preassignedFareProduct} />
  ) : (
    <NotInspectableContent />
  );
};

const InspectableContent = ({
  preassignedFareProduct,
}: {
  preassignedFareProduct?: PreassignedFareProduct;
}) => {
  const styles = useStyles();
  const themeColor = useFareProductColor(preassignedFareProduct?.type);

  const {fareProductTypeConfigs} = useFirestoreConfigurationContext();
  const fareProductTypeConfig = fareProductTypeConfigs.find(
    (c) => c.type === preassignedFareProduct?.type,
  );

  const shouldFill =
    fareProductTypeConfig?.illustration?.includes('period') ||
    fareProductTypeConfig?.illustration === 'hour24' ||
    fareProductTypeConfig?.illustration === 'youth' ||
    fareProductTypeConfig?.illustration === 'city';

  const InspectionSvg = getInspectionSvg(
    fareProductTypeConfig?.illustration,
    fareProductTypeConfig?.transportModes,
  );

  return (
    <View
      style={[
        styles.symbolContainer,
        // On Android we need to set the border width to 0 to avoid a visual glitch if the symbol is filled
        {borderColor: themeColor.background, borderWidth: shouldFill ? 0 : 2},
      ]}
    >
      <View
        style={[
          styles.symbolContent,
          {
            backgroundColor: shouldFill ? themeColor.background : undefined,
          },
        ]}
        testID="inspectableIcon"
      >
        <ThemeIcon
          svg={InspectionSvg}
          color={shouldFill ? themeColor : undefined}
          size="large"
        />
      </View>
    </View>
  );
};

const NotInspectableContent = () => {
  const {t} = useTranslation();
  const {theme} = useThemeContext();
  const styles = useStyles();

  const borderColor = theme.color.status['warning'].primary.background;

  return (
    <View style={[styles.symbolContainer, {borderColor}]}>
      <View style={styles.symbolContent} testID="notInspectableIcon">
        <ThemeText
          typography="body__xs"
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
    </View>
  );
};

const getInspectionSvg = (
  illustration: string | undefined,
  transportModes: ProductTypeTransportModes[] | undefined,
): ((props: SvgProps) => React.JSX.Element) => {
  if (illustration === 'night') return Moon;
  if (illustration === 'youth') return Youth;
  if (illustration === 'school') return Student;

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
