import {StyleSheet, useThemeContext} from '@atb/theme';
import {FareContractTexts, useTranslation} from '@atb/translations';
import {ActivityIndicator, View} from 'react-native';
import {ThemeText} from '@atb/components/text';
import React from 'react';
import {ThemeIcon} from '@atb/components/theme-icon';
import {Moon, Student, Youth} from '@atb/assets/svg/mono-icons/ticketing';
import {ContrastColor} from '@atb/theme/colors';
import {useMobileTokenContext} from '@atb/modules/mobile-token';
import {getTransportModeSvg} from '@atb/components/icon-box';
import {SvgProps} from 'react-native-svg';
import {useFareProductColor} from '../use-fare-product-color';
import {FareContractInfo, TransportMode} from '@atb/modules/fare-contracts';

export type InspectionSymbolProps = {
  fareContractInfo: FareContractInfo;
  sentTicket?: boolean;
};

export const InspectionSymbol = ({
  fareContractInfo,
  sentTicket,
}: InspectionSymbolProps) => {
  const styles = useStyles();
  const {theme} = useThemeContext();

  const fareProductColor = useFareProductColor(
    fareContractInfo.allTransportModes,
  );
  const {isInspectable, mobileTokenStatus} = useMobileTokenContext();
  const themeColor = isInspectable
    ? fareProductColor
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
          illustration={
            fareContractInfo.tickets.find((t) => t.illustration !== undefined)
              ?.illustration
          }
          transportModes={fareContractInfo.allTransportModes}
          themeColor={themeColor}
        />
      ) : (
        <NotInspectableContent />
      )}
    </View>
  );
};

const InspectableContent = ({
  illustration,
  transportModes,
  themeColor,
}: {
  illustration?: string;
  transportModes?: TransportMode[];
  themeColor: ContrastColor;
}) => {
  const styles = useStyles();

  const shouldFill =
    illustration?.includes('period') ||
    illustration === 'hour24' ||
    illustration === 'youth' ||
    illustration === 'city';

  const InspectionSvg = getInspectionSvg(illustration, transportModes);

  return (
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
  );
};

const NotInspectableContent = () => {
  const {t} = useTranslation();
  const styles = useStyles();
  return (
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
  );
};

const getInspectionSvg = (
  illustration: string | undefined,
  transportModes: TransportMode[] | undefined,
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
