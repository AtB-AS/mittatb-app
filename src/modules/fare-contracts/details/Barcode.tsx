import DeviceBrightness from '@adrianso/react-native-device-brightness';
import {MessageInfoBox} from '@atb/components/message-info-box';
import {ValidityStatus} from '../utils';
import {useMobileTokenContext} from '@atb/modules/mobile-token';
import {StyleSheet, useThemeContext} from '@atb/theme';
import {FareContractType} from '@atb-as/utils';
import {FareContractTexts, useTranslation} from '@atb/translations';
import {useIsFocusedAndActive} from '@atb/utils/use-is-focused-and-active';
import Bugsnag from '@bugsnag/react-native';
import {renderAztec} from '@entur-private/abt-mobile-barcode-javascript-lib';
import QRCode from 'qrcode';
import React, {RefObject, useEffect, useRef, useState} from 'react';
import {ActivityIndicator, View} from 'react-native';
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
import {BottomSheetModal as GorhomBottomSheetModal} from '@gorhom/bottom-sheet';
import {giveFocus} from '@atb/utils/use-focus-on-load';
import {
  BottomSheetHeaderType,
  BottomSheetModal,
} from '@atb/components/bottom-sheet';

type Props = {
  validityStatus: ValidityStatus;
  fc: FareContractType;
};

export function Barcode({validityStatus, fc}: Props): React.JSX.Element | null {
  const {mobileTokenStatus} = useMobileTokenContext();
  const {enable_new_token_barcode} = useRemoteConfigContext();
  useScreenBrightnessIncrease();
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
  const {
    aztec_code_size_in_cm,
    aztec_code_padding,
    enable_new_token_barcode_base64,
  } = useRemoteConfigContext();

  useEffect(() => {
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
      // Stop updating data for RNBarcodeInspectionView on unmount
      endInspection();
    };
  }, [enable_new_token_barcode_base64]);

  return (
    <View style={styles.barcodeInspectionContainer}>
      <View
        style={[styles.barcodeInspection, {padding: aztec_code_padding}]}
        testID="mobileTokenBarcode"
      >
        <RNBarcodeInspectionView sizeInCm={aztec_code_size_in_cm} />
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
  const {aztec_code_max_height, aztec_code_padding} = useRemoteConfigContext();
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
      style={[
        styles.aztecCode,
        {padding: aztec_code_padding, maxHeight: aztec_code_max_height},
      ]}
      accessible={true}
      accessibilityLabel={t(FareContractTexts.details.barcodeA11yLabel)}
      testID="mobileTokenBarcode"
    >
      <SvgXml xml={aztecXml} width="100%" height="100%" />
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
  const {theme} = useThemeContext();
  return (
    <View style={{flex: 1}}>
      <ActivityIndicator
        animating={true}
        color={theme.color.foreground.dynamic.primary}
      />
    </View>
  );
};

const StaticAztec = ({fc}: {fc: FareContractType}) => {
  const styles = useStyles();
  const {aztec_code_max_height, aztec_code_padding} = useRemoteConfigContext();
  const {t} = useTranslation();
  const [aztecXml, setAztecXml] = useState<string>();
  const onCloseFocusRef = useRef<View | null>(null);
  const bottomSheetModalRef = useRef<GorhomBottomSheetModal | null>(null);

  useEffect(() => {
    if (fc.qrCode) {
      setAztecXml(renderAztec(fc.qrCode));
    }
  }, [fc.qrCode, setAztecXml]);

  if (!aztecXml) return null;

  return (
    <>
      <View
        style={[
          styles.aztecCode,
          {padding: aztec_code_padding, maxHeight: aztec_code_max_height},
        ]}
      >
        <NativeBlockButton
          onPress={() => bottomSheetModalRef.current?.present()}
          accessibilityRole="button"
          accessibilityLabel={t(
            FareContractTexts.details.barcodeA11yLabelWithActivation,
          )}
          testID="staticBarcode"
          ref={onCloseFocusRef}
        >
          <SvgXml xml={aztecXml} width="100%" height="100%" />
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
  const {aztec_code_max_height, aztec_code_padding} = useRemoteConfigContext();
  const {t} = useTranslation();
  const [qrCodeSvg, setQrCodeSvg] = useState<string>();
  const onCloseFocusRef = useRef<View | null>(null);
  const bottomSheetModalRef = useRef<GorhomBottomSheetModal | null>(null);

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
          {padding: aztec_code_padding, maxHeight: aztec_code_max_height},
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
          <SvgXml xml={qrCodeSvg} width="100%" height="100%" />
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
  },
  barcodeInspection: {
    backgroundColor: 'white',
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
  bottomSheetModalRef: RefObject<GorhomBottomSheetModal | null>;
}) => {
  const styles = useStyles();
  const {aztec_code_max_height, aztec_code_padding} = useRemoteConfigContext();
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
        <View
          style={[
            styles.aztecCode,
            {padding: aztec_code_padding, maxHeight: aztec_code_max_height},
            styles.staticQrCode,
          ]}
        >
          <NativeBlockButton
            onPress={() => bottomSheetModalRef.current?.dismiss()}
            accessible={true}
            accessibilityLabel={t(
              FareContractTexts.details.barcodeBottomSheetA11yLabel,
            )}
            testID="staticBigQRCode"
          >
            <SvgXml xml={qrCodeSvg ?? ''} width="100%" height="100%" />
          </NativeBlockButton>
        </View>
      </View>
    </BottomSheetModal>
  );
};
