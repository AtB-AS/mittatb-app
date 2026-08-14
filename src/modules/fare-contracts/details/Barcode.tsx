import DeviceBrightness from '@adrianso/react-native-device-brightness';
import {MessageInfoBox} from '@atb/components/message-info-box';
import {ValidityStatus} from '../utils';
import {useMobileTokenContext} from '@atb/modules/mobile-token';
import {SecureView} from '@atb/modules/native';
import {StyleSheet} from '@atb/theme';
import {FareContractType} from '@atb-as/utils';
import {FareContractTexts, useTranslation} from '@atb/translations';
import {useIsFocusedAndActive} from '@atb/utils/use-is-focused-and-active';
import Bugsnag from '@bugsnag/react-native';
import {renderAztec} from '@entur-private/abt-mobile-barcode-javascript-lib';
import QRCode from 'qrcode';
import React, {RefObject, useEffect, useRef, useState} from 'react';
import {Alert, View} from 'react-native';
import {NativeBlockButton} from '@atb/components/native-button';
import {SvgXml} from 'react-native-svg';
import {GenericSectionItem} from '@atb/components/sections';
import {useGetSignedTokenQuery} from '@atb/modules/mobile-token';
import {useRemoteConfigContext} from '@atb/modules/remote-config';
import {
  beginInspection,
  endInspection,
  RNBarcodeInspectionView,
} from '@entur-private/abt-token-state-react-native-lib';
import {CONTEXT_ID} from '@atb/modules/mobile-token';
import {notifyBugsnag} from '@atb/utils/bugsnag-utils';
import {giveFocus} from '@atb/utils/use-focus-on-load';
import {
  BottomSheetHeaderType,
  BottomSheetModal,
  BottomSheetModalMethods,
} from '@atb/components/bottom-sheet';
import {Loading} from '@atb/components/loading';
import {useScreenshotAware} from 'react-native-screenshot-aware';

type Props = {
  validityStatus: ValidityStatus;
  fc: FareContractType;
};

export function Barcode({validityStatus, fc}: Props): React.JSX.Element | null {
  const {t} = useTranslation();
  const {mobileTokenStatus} = useMobileTokenContext();
  const {enable_new_token_barcode} = useRemoteConfigContext();
  const isFocusedAndActive = useIsFocusedAndActive();

  useScreenBrightnessIncrease();

  useScreenshotAware(() => {
    if (isFocusedAndActive) {
      Alert.alert(
        t(FareContractTexts.details.screenshotWarning.title),
        t(FareContractTexts.details.screenshotWarning.description),
      );
    }
  });

  if (validityStatus !== 'valid') return null;

  switch (mobileTokenStatus) {
    case 'loading':
      return <LoadingBarcode />;
    case 'fallback':
      return <StaticAztec fc={fc} />;
    case 'staticQr':
      return <StaticQrCode fc={fc} />;
    case 'success-and-inspectable':
      if (enable_new_token_barcode) {
        return <BarcodeInspectionView />;
      } else {
        return <MobileTokenAztec fc={fc} />;
      }
    case 'success-not-inspectable':
      return <DeviceNotInspectable />;
    case 'error':
      return <BarcodeError />;
  }
}

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
        } catch {
          Bugsnag.leaveBreadcrumb(`Failed to set brightness.`);
        }
      }

      setLevel();

      return () => {
        try {
          if (originalBrightness) {
            DeviceBrightness.setBrightnessLevel(originalBrightness);
          }
        } catch {
          Bugsnag.leaveBreadcrumb(`Failed to reset brightness.`);
        }
      };
    },
    [isActive],
  );
}

const BarcodeInspectionView = () => {
  const styles = useStyles();
  const {enable_new_token_barcode_base64} = useRemoteConfigContext();
  const isFocusedAndActive = useIsFocusedAndActive();

  useEffect(() => {
    // Only run inspection while the screen is focused and the app is in the
    // foreground. Re-running when the app becomes active again (e.g. after the
    // phone is unlocked) forces an immediate barcode refresh: the native ~30s
    // update timer is suspended while backgrounded, so the displayed barcode
    // would otherwise stay frozen and expire until the next tick fires.
    if (!isFocusedAndActive) return;

    // Prepare data for RNBarcodeInspectionView
    beginInspection(CONTEXT_ID, {
      visualInspectionNonces: undefined,
      includeCertificate: false,
      base64EncodedBarcode: enable_new_token_barcode_base64,

      // Exclude some data to make the barcode more readable for scanners. This
      // is the same configuration as in the Entur app as of October 2025.
      deviceDetails: {
        application: false,
        os: false,
      },
    }).catch((error) => {
      notifyBugsnag('Error beginning inspection', {metadata: {error}});
    });
    return () => {
      // Stop updating data for RNBarcodeInspectionView when backgrounded,
      // navigated away, or unmounted.
      endInspection();
    };
  }, [enable_new_token_barcode_base64, isFocusedAndActive]);

  return (
    <View style={styles.barcodeInspectionContainer}>
      <View style={styles.barcodeInspection} testID="mobileTokenBarcode">
        <SecureView>
          <RNBarcodeInspectionView sizeInCm={3.5} />
        </SecureView>
      </View>
    </View>
  );
};

/**
 * Show aztec code for mobile token. This can also fall back to static aztec if
 * anything goes wrong when getting the signed mobile token.
 *
 * @deprecated Use BarcodeInspectionView instead
 */
const MobileTokenAztec = ({fc}: {fc: FareContractType}) => {
  const styles = useStyles();
  const {t} = useTranslation();
  const {data: signedToken} = useGetSignedTokenQuery();
  const [aztecCodeError, setAztecCodeError] = useState(false);
  const [aztecXml, setAztecXml] = useState<string>();

  useEffect(() => {
    if (!signedToken) {
      setAztecCodeError(true);
    } else {
      setAztecCodeError(false);
      setAztecXml(renderAztec(signedToken));
    }
  }, [signedToken]);

  if (aztecCodeError) {
    return <StaticAztec fc={fc} />;
  } else if (!aztecXml) {
    return <LoadingBarcode />;
  }

  return (
    <View
      style={styles.aztecCode}
      accessible={true}
      accessibilityLabel={t(FareContractTexts.details.barcodeA11yLabel)}
      testID="mobileTokenBarcode"
    >
      <SecureView style={styles.secureViewFill}>
        <SvgXml xml={aztecXml} width="100%" height="100%" />
      </SecureView>
    </View>
  );
};

const BarcodeError = () => {
  const {t} = useTranslation();
  const {retry} = useMobileTokenContext();

  return (
    <GenericSectionItem>
      <MessageInfoBox
        type="error"
        title={t(FareContractTexts.details.barcodeErrors.generic.title)}
        message={t(FareContractTexts.details.barcodeErrors.generic.text)}
        onPressConfig={{
          action: retry,
          text: t(FareContractTexts.details.barcodeErrors.generic.retry),
        }}
      />
    </GenericSectionItem>
  );
};

const DeviceNotInspectable = () => {
  const {t} = useTranslation();
  const {tokens} = useMobileTokenContext();
  const inspectableToken = tokens.find((t) => t.isInspectable);
  if (!inspectableToken) return null;
  const message =
    inspectableToken.type === 'travel-card'
      ? t(FareContractTexts.details.barcodeErrors.notInspectableDevice.tCard)
      : t(
          FareContractTexts.details.barcodeErrors.notInspectableDevice.wrongDevice(
            inspectableToken.name ||
              t(
                FareContractTexts.details.barcodeErrors.notInspectableDevice
                  .unnamedDevice,
              ),
          ),
        );
  return (
    <MessageInfoBox
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
  return (
    <View style={{flex: 1, alignItems: 'center', justifyContent: 'center'}}>
      <Loading size="large" animating={true} />
    </View>
  );
};

const StaticAztec = ({fc}: {fc: FareContractType}) => {
  const styles = useStyles();
  const {t} = useTranslation();
  const [aztecXml, setAztecXml] = useState<string>();
  const onCloseFocusRef = useRef<View | null>(null);
  const bottomSheetModalRef = useRef<BottomSheetModalMethods | null>(null);

  useEffect(() => {
    if (fc.qrCode) {
      setAztecXml(renderAztec(fc.qrCode));
    }
  }, [fc.qrCode, setAztecXml]);

  if (!aztecXml) return null;

  return (
    <>
      <View style={styles.aztecCode}>
        <NativeBlockButton
          onPress={() => bottomSheetModalRef.current?.present()}
          accessibilityRole="button"
          accessibilityLabel={t(
            FareContractTexts.details.barcodeA11yLabelWithActivation,
          )}
          testID="staticBarcode"
          ref={onCloseFocusRef}
        >
          <SecureView style={styles.secureViewFill}>
            <SvgXml xml={aztecXml} width="100%" height="100%" />
          </SecureView>
        </NativeBlockButton>
      </View>
      <StaticBarcodeBottomSheet
        qrCodeSvg={aztecXml}
        onCloseFocusRef={onCloseFocusRef}
        bottomSheetModalRef={bottomSheetModalRef}
      />
    </>
  );
};

const StaticQrCode = ({fc}: {fc: FareContractType}) => {
  const styles = useStyles();
  const {t} = useTranslation();
  const [qrCodeSvg, setQrCodeSvg] = useState<string>();
  const onCloseFocusRef = useRef<View | null>(null);
  const bottomSheetModalRef = useRef<BottomSheetModalMethods | null>(null);

  useEffect(() => {
    if (fc.qrCode) {
      QRCode.toString(fc.qrCode, {type: 'svg'}).then(setQrCodeSvg);
    }
  }, [fc.qrCode, setQrCodeSvg]);

  if (!qrCodeSvg) return null;

  return (
    <>
      <View
        style={[
          styles.aztecCode,
          styles.staticQrCode,
          styles.staticQrCodeSmall,
        ]}
      >
        <NativeBlockButton
          onPress={() => bottomSheetModalRef.current?.present()}
          accessibilityRole="button"
          accessibilityLabel={t(
            FareContractTexts.details.barcodeA11yLabelWithActivation,
          )}
          testID="staticQRCode"
          ref={onCloseFocusRef}
        >
          <SecureView style={styles.secureViewFill}>
            <SvgXml xml={qrCodeSvg} width="100%" height="100%" />
          </SecureView>
        </NativeBlockButton>
      </View>
      <StaticBarcodeBottomSheet
        qrCodeSvg={qrCodeSvg}
        onCloseFocusRef={onCloseFocusRef}
        bottomSheetModalRef={bottomSheetModalRef}
      />
    </>
  );
};

const useStyles = StyleSheet.createThemeHook(() => ({
  aztecCode: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: '#FFFFFF',
    padding: 20,
    maxHeight: 275,
  },
  barcodeInspection: {
    backgroundColor: 'white',
    padding: 20,
  },
  secureViewFill: {
    width: '100%',
    height: '100%',
  },
  barcodeInspectionContainer: {
    flex: 1,
    alignItems: 'center',
  },
  staticBottomContainer: {
    flex: 1,
    backgroundColor: '#ffffff',
  },
  staticQrCode: {
    padding: 0,
    marginLeft: 'auto',
    marginRight: 'auto',
    maxWidth: 250,
  },
  staticQrCodeSmall: {
    maxWidth: 125,
  },
}));

const StaticBarcodeBottomSheet = ({
  qrCodeSvg,
  onCloseFocusRef,
  bottomSheetModalRef,
}: {
  qrCodeSvg: string | undefined;
  onCloseFocusRef: RefObject<View | null>;
  bottomSheetModalRef: RefObject<BottomSheetModalMethods | null>;
}) => {
  const styles = useStyles();
  const {t} = useTranslation();

  return (
    <BottomSheetModal
      bottomSheetModalRef={bottomSheetModalRef}
      heading={t(FareContractTexts.details.bottomSheetTitle)}
      bottomSheetHeaderType={BottomSheetHeaderType.Close}
      closeCallback={() => giveFocus(onCloseFocusRef)}
      enableDynamicSizing={false}
      snapPoints={['80%']}
    >
      <View style={styles.staticBottomContainer}>
        <View style={[styles.aztecCode, styles.staticQrCode]}>
          <NativeBlockButton
            onPress={() => bottomSheetModalRef.current?.dismiss()}
            accessible={true}
            accessibilityLabel={t(
              FareContractTexts.details.barcodeBottomSheetA11yLabel,
            )}
            testID="staticBigQRCode"
          >
            <SecureView style={styles.secureViewFill}>
              <SvgXml xml={qrCodeSvg ?? ''} width="100%" height="100%" />
            </SecureView>
          </NativeBlockButton>
        </View>
      </View>
    </BottomSheetModal>
  );
};
