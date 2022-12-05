import {ValidityStatus} from '@atb/screens/Ticketing/FareContracts/utils';
import * as Sections from '@atb/components/sections';
import {ActivityIndicator, View} from 'react-native';
import {FareContractTexts, useTranslation} from '@atb/translations';
import {SvgXml} from 'react-native-svg';
import React, {useCallback, useEffect, useState} from 'react';
import {StyleSheet, useTheme} from '@atb/theme';
import {
  useHasEnabledMobileToken,
  useMobileTokenContextState,
} from '@atb/mobile-token/MobileTokenContext';
import useInterval from '@atb/utils/use-interval';
import {MessageBox} from '@atb/components/message-box';
import ThemeText from '@atb/components/text';
import {
  findInspectable,
  getDeviceName,
  isTravelCardToken,
} from '@atb/mobile-token/utils';
import {FareContract} from '@atb/ticketing';
import {renderAztec} from '@entur-private/abt-mobile-client-sdk';

type Props = {
  validityStatus: ValidityStatus;
  isInspectable: boolean;
  fc: FareContract;
};

export default function Barcode({
  validityStatus,
  isInspectable,
  fc,
}: Props): JSX.Element | null {
  const status = useBarcodeCodeStatus(validityStatus, isInspectable);

  switch (status) {
    case 'none':
      return null;
    case 'loading':
      return <LoadingBarcode />;
    case 'static':
      return <StaticAztec fc={fc} />;
    case 'mobiletoken':
      return <MobileTokenAztec fc={fc} />;
    case 'other':
      return <DeviceNotInspectable />;
  }
}

const useBarcodeCodeStatus = (
  validityStatus: ValidityStatus,
  isInspectable: boolean,
) => {
  const {remoteTokens, deviceIsInspectable, isLoading, isError} =
    useMobileTokenContextState();
  const mobileTokenEnabled = useHasEnabledMobileToken();

  if (!isInspectable) return 'none';
  if (validityStatus !== 'valid') return 'none';

  if (!mobileTokenEnabled) return 'static';

  if (isLoading) return 'loading';
  if (isError) return 'static';
  if (deviceIsInspectable) return 'mobiletoken';

  if (findInspectable(remoteTokens)) return 'other';

  return 'static';
};

const UPDATE_INTERVAL = 10000;
/**
 * Show aztec code for mobile token. This can also fall back to static aztec if
 * anything goes wrong when getting the signed mobile token.
 */
const MobileTokenAztec = ({fc}: {fc: FareContract}) => {
  const styles = useStyles();
  const {t} = useTranslation();
  const {getSignedToken} = useMobileTokenContextState();
  const [aztecCodeError, setAztecCodeError] = useState(false);
  const [aztecXml, setAztecXml] = useState<string>();

  const renderAztecCode = async () => {
    const signedToken = await getSignedToken();
    if (!signedToken) {
      setAztecCodeError(true);
    } else {
      setAztecCodeError(false);
      setAztecXml(renderAztec(signedToken));
    }
  };

  useInterval(renderAztecCode, UPDATE_INTERVAL, [], false, true);

  if (aztecCodeError) {
    return <StaticAztec fc={fc} />;
  } else if (!aztecXml) {
    return <LoadingBarcode />;
  }

  return (
    <Sections.GenericItem>
      <View style={{alignItems: 'center'}}>
        <View
          style={styles.aztecCode}
          accessible={true}
          accessibilityLabel={t(FareContractTexts.details.barcodeA11yLabel)}
          testID="mobileTokenBarcode"
        >
          <SvgXml xml={aztecXml} width="100%" height="100%" />
        </View>
      </View>
    </Sections.GenericItem>
  );
};

// const BarcodeError = ({retry}: {retry?: (forceRestart: boolean) => void}) => {
//   const {t} = useTranslation();
//
//   return (
//     <Sections.GenericItem>
//       <MessageBox
//         type={'error'}
//         title={t(TicketTexts.details.barcodeErrors.generic.title)}
//         message={t(TicketTexts.details.barcodeErrors.generic.text)}
//         onPress={retry && (() => retry(true))}
//         onPressText={retry && t(TicketTexts.details.barcodeErrors.generic.retry)}
//       />
//     </Sections.GenericItem>
//   );
// };

const DeviceNotInspectable = () => {
  const {t} = useTranslation();
  const {remoteTokens} = useMobileTokenContextState();
  const inspectableToken = findInspectable(remoteTokens);
  if (!inspectableToken) return null;
  const message = isTravelCardToken(inspectableToken)
    ? t(FareContractTexts.details.barcodeErrors.notInspectableDevice.tCard)
    : t(
        FareContractTexts.details.barcodeErrors.notInspectableDevice.wrongDevice(
          getDeviceName(inspectableToken) ||
            t(
              FareContractTexts.details.barcodeErrors.notInspectableDevice
                .unnamedDevice,
            ),
        ),
      );
  return (
    <Sections.GenericItem>
      <MessageBox
        type={'warning'}
        title={t(
          FareContractTexts.details.barcodeErrors.notInspectableDevice.title,
        )}
        message={message}
        isMarkdown={true}
      />
    </Sections.GenericItem>
  );
};

const LoadingBarcode = () => {
  const {theme} = useTheme();
  return (
    <Sections.GenericItem>
      <View style={{flex: 1}}>
        <ActivityIndicator animating={true} color={theme.text.colors.primary} />
      </View>
    </Sections.GenericItem>
  );
};

const StaticAztec = ({fc}: {fc: FareContract}) => {
  const styles = useStyles();
  const {t} = useTranslation();
  const [aztecXml, setAztecXml] = useState<string>();

  useEffect(() => {
    if (fc.qrCode) {
      setAztecXml(renderAztec(fc.qrCode));
    }
  }, [fc.qrCode, setAztecXml, renderAztec]);

  if (!aztecXml) return null;

  return (
    <Sections.GenericItem>
      <View
        style={styles.aztecCode}
        accessible={true}
        accessibilityLabel={t(FareContractTexts.details.barcodeA11yLabel)}
        testID="staticBarcode"
      >
        <SvgXml xml={aztecXml} width="100%" height="100%" />
      </View>
    </Sections.GenericItem>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  aztecCode: {
    width: '100%',
    aspectRatio: 1,
    padding: theme.spacings.large,
    backgroundColor: '#FFFFFF',
  },
}));
