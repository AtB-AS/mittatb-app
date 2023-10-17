import DeviceBrightness from '@adrianso/react-native-device-brightness';
import {useRemoteConfig} from '@atb/RemoteConfigContext';
import {
  BottomSheetContainer,
  useBottomSheet,
} from '@atb/components/bottom-sheet';
import {MessageBox} from '@atb/components/message-box';
import {ScreenHeaderWithoutNavigation} from '@atb/components/screen-header';
import {ValidityStatus} from '@atb/fare-contracts/utils';
import {
  useHasEnabledMobileToken,
  useMobileTokenContextState,
} from '@atb/mobile-token/MobileTokenContext';
import {
  findInspectable,
  getDeviceName,
  isTravelCardToken,
} from '@atb/mobile-token/utils';
import {StyleSheet, useTheme} from '@atb/theme';
import {FareContract} from '@atb/ticketing';
import {
  FareContractTexts,
  ScreenHeaderTexts,
  useTranslation,
} from '@atb/translations';
import {useInterval} from '@atb/utils/use-interval';
import {useIsFocusedAndActive} from '@atb/utils/use-is-focused-and-active';
import Bugsnag from '@bugsnag/react-native';
import {renderAztec} from '@entur-private/abt-mobile-barcode-javascript-lib';
import QRCode from 'qrcode';
import React, {useEffect, useState} from 'react';
import {ActivityIndicator, View} from 'react-native';
import {PressableOpacity} from '@atb/components/pressable-opacity';
import {SvgXml} from 'react-native-svg';

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
  useScreenBrightnessIncrease();

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
  const {remoteTokens, deviceIsInspectable, isLoading, isTimedout, isError} =
    useMobileTokenContextState();
  const mobileTokenEnabled = useHasEnabledMobileToken();
  const {use_trygg_overgang_qr_code: useTryggOvergangQrCode} =
    useRemoteConfig();

  if (!isInspectable) return 'none';
  if (validityStatus !== 'valid') return 'none';

  if (useTryggOvergangQrCode) return 'staticQrCode';

  if (!mobileTokenEnabled) return 'static';

  if (isTimedout) return 'static';
  if (isLoading) return 'loading';
  if (isError) return 'static';
  if (deviceIsInspectable) return 'mobiletoken';

  if (findInspectable(remoteTokens)) return 'other';

  return 'static';
};

function useScreenBrightnessIncrease() {
  const isActive = useIsFocusedAndActive();

  useEffect(
    function () {
      let originalBrightness: number | undefined;
      async function setLevel() {
        try {
          if (isActive) {
            originalBrightness = await DeviceBrightness.getBrightnessLevel();
            DeviceBrightness.setBrightnessLevel(1);
          }
        } catch (e) {
          Bugsnag.leaveBreadcrumb(`Failed to set brightness.`);
        }
      }

      setLevel();

      return () => {
        try {
          if (originalBrightness) {
            DeviceBrightness.setBrightnessLevel(originalBrightness);
          }
        } catch (e) {
          Bugsnag.leaveBreadcrumb(`Failed to reset brightness.`);
        }
      };
    },
    [isActive],
  );
}

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
    <MessageBox
      type="warning"
      title={t(
        FareContractTexts.details.barcodeErrors.notInspectableDevice.title,
      )}
      message={message}
      isMarkdown={true}
    />
  );
};

const LoadingBarcode = () => {
  const {theme} = useTheme();
  return (
    <View style={{flex: 1}}>
      <ActivityIndicator animating={true} color={theme.text.colors.primary} />
    </View>
  );
};

const StaticAztec = ({fc}: {fc: FareContract}) => {
  const styles = useStyles();
  const {t} = useTranslation();
  const [aztecXml, setAztecXml] = useState<string>();
  const onOpenBarcodePress = useStaticBarcodeBottomSheet(aztecXml);

  useEffect(() => {
    if (fc.qrCode) {
      setAztecXml(renderAztec(fc.qrCode));
    }
  }, [fc.qrCode, setAztecXml, renderAztec]);

  if (!aztecXml) return null;

  return (
    <View
      style={styles.aztecCode}
      accessible={true}
      accessibilityLabel={t(FareContractTexts.details.barcodeA11yLabel)}
      testID="staticBarcode"
    >
      <PressableOpacity
        onPress={onOpenBarcodePress}
        accessibilityRole="button"
        accessibilityHint={t(FareContractTexts.details.barcodeButtonA11yLabel)}
      >
        <SvgXml xml={aztecXml} width="100%" height="100%" />
      </PressableOpacity>
    </View>
  );
};

const StaticQrCode = ({fc}: {fc: FareContract}) => {
  const styles = useStyles();
  const {t} = useTranslation();
  const [qrCodeSvg, setQrCodeSvg] = useState<string>();
  const onOpenBarcodePress = useStaticBarcodeBottomSheet(qrCodeSvg);

  useEffect(() => {
    if (fc.qrCode) {
      QRCode.toString(fc.qrCode, {type: 'svg'}).then(setQrCodeSvg);
    }
  }, [fc.qrCode, setQrCodeSvg]);

  if (!qrCodeSvg) return null;

  return (
    <View
      style={[styles.aztecCode, styles.staticQrCode, styles.staticQrCodeSmall]}
      accessible={true}
      accessibilityLabel={t(FareContractTexts.details.barcodeA11yLabel)}
      testID="staticQRCode"
    >
      <PressableOpacity
        onPress={onOpenBarcodePress}
        accessibilityRole="button"
        accessibilityHint={t(FareContractTexts.details.barcodeButtonA11yLabel)}
      >
        <SvgXml xml={qrCodeSvg} width="100%" height="100%" />
      </PressableOpacity>
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  aztecCode: {
    width: '100%',
    aspectRatio: 1,
    padding: theme.spacings.large,
    backgroundColor: '#FFFFFF',
  },
  staticBottomContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  staticQrCode: {
    padding: 0,
    marginLeft: 'auto',
    marginRight: 'auto',
    maxWidth: 300,
  },
  staticQrCodeSmall: {
    maxWidth: 200,
  },
}));

function useStaticBarcodeBottomSheet(qrCodeSvg: string | undefined) {
  const styles = useStyles();
  const {t} = useTranslation();

  const {
    open: openBottomSheet,
    close: closeBottomSheet,
    onOpenFocusRef,
  } = useBottomSheet();

  const onOpenBarcodePress = () => {
    openBottomSheet(() => (
      <BottomSheetContainer testID="barcodeBottomSheet" fullHeight>
        <ScreenHeaderWithoutNavigation
          title={t(FareContractTexts.details.bottomSheetTitle)}
          color="background_1"
          leftButton={{
            text: t(ScreenHeaderTexts.headerButton.close.text),
            type: 'close',
            onPress: closeBottomSheet,
          }}
        />

        <View style={styles.staticBottomContainer}>
          <View
            ref={onOpenFocusRef}
            style={[styles.aztecCode, styles.staticQrCode]}
            accessible={true}
            accessibilityLabel={t(FareContractTexts.details.barcodeA11yLabel)}
            testID="staticQRCode"
          >
            <SvgXml xml={qrCodeSvg ?? ''} width="100%" height="100%" />
          </View>
        </View>
      </BottomSheetContainer>
    ));
  };

  return onOpenBarcodePress;
}
