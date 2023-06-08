import {ValidityStatus} from '@atb/fare-contracts/utils';
import {ActivityIndicator, View} from 'react-native';
import {FareContractTexts, useTranslation} from '@atb/translations';
import {SvgXml} from 'react-native-svg';
import React, {useEffect, useState} from 'react';
import {StyleSheet, useTheme} from '@atb/theme';
import {
  useHasEnabledMobileToken,
  useMobileTokenContextState,
} from '@atb/mobile-token/MobileTokenContext';
import {useInterval} from '@atb/utils/use-interval';
import {MessageBox} from '@atb/components/message-box';
import {
  findInspectable,
  getDeviceName,
  isTravelCardToken,
} from '@atb/mobile-token/utils';
import {FareContract} from '@atb/ticketing';
import {renderAztec} from '@entur-private/abt-mobile-client-sdk';
import {GenericSectionItem} from '@atb/components/sections';
import {useRemoteConfig} from '@atb/RemoteConfigContext';
import QRCode from 'qrcode';

type Props = {
  validityStatus: ValidityStatus;
  isInspectable: boolean;
  fc: FareContract;
};

export function Barcode({
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
    case 'staticQrCode':
      return <StaticQrCode fc={fc} />;
  }
}

const useBarcodeCodeStatus = (
  validityStatus: ValidityStatus,
  isInspectable: boolean,
) => {
  const {remoteTokens, deviceIsInspectable, isLoading, isError} =
    useMobileTokenContextState();
  const mobileTokenEnabled = useHasEnabledMobileToken();
  const {use_trygg_overgang_qr_code: useTryggOvergangQrCode} =
    useRemoteConfig();

  if (!isInspectable) return 'none';
  if (validityStatus !== 'valid') return 'none';

  if (useTryggOvergangQrCode) return 'staticQrCode';

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
    <GenericSectionItem>
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
    </GenericSectionItem>
  );
};

// const BarcodeError = ({retry}: {retry?: (forceRestart: boolean) => void}) => {
//   const {t} = useTranslation();
//
//   return (
//     <GenericSectionItem>
//       <MessageBox
//         type={'error'}
//         title={t(TicketTexts.details.barcodeErrors.generic.title)}
//         message={t(TicketTexts.details.barcodeErrors.generic.text)}
//         onPress={retry && (() => retry(true))}
//         onPressText={retry && t(TicketTexts.details.barcodeErrors.generic.retry)}
//       />
//     </GenericSectionItem>
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
    <GenericSectionItem>
      <MessageBox
        type={'warning'}
        title={t(
          FareContractTexts.details.barcodeErrors.notInspectableDevice.title,
        )}
        message={message}
        isMarkdown={true}
      />
    </GenericSectionItem>
  );
};

const LoadingBarcode = () => {
  const {theme} = useTheme();
  return (
    <GenericSectionItem>
      <View style={{flex: 1}}>
        <ActivityIndicator animating={true} color={theme.text.colors.primary} />
      </View>
    </GenericSectionItem>
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
    <GenericSectionItem>
      <View
        style={styles.aztecCode}
        accessible={true}
        accessibilityLabel={t(FareContractTexts.details.barcodeA11yLabel)}
        testID="staticBarcode"
      >
        <SvgXml xml={aztecXml} width="100%" height="100%" />
      </View>
    </GenericSectionItem>
  );
};

const StaticQrCode = ({fc}: {fc: FareContract}) => {
  const styles = useStyles();
  const {t} = useTranslation();
  const [qrCodeSvg, setQrCodeSvg] = useState<string>();

  useEffect(() => {
    if (fc.qrCode) {
      QRCode.toString(fc.qrCode, {type: 'svg'}).then(setQrCodeSvg);
    }
  }, [fc.qrCode, setQrCodeSvg]);

  if (!qrCodeSvg) return null;

  return (
    <GenericSectionItem>
      <View
        style={[styles.aztecCode, styles.staticQrCode]}
        accessible={true}
        accessibilityLabel={t(FareContractTexts.details.barcodeA11yLabel)}
        testID="staticQRCode"
      >
        <SvgXml xml={qrCodeSvg} width="100%" height="100%" />
      </View>
    </GenericSectionItem>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  aztecCode: {
    width: '100%',
    aspectRatio: 1,
    padding: theme.spacings.large,
    backgroundColor: '#FFFFFF',
  },
  staticQrCode: {
    aspectRatio: 1.25,
  },
}));
