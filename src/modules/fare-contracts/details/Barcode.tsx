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
import {NativeTouchable} from '@atb/components/native-touchable';
import {SvgXml} from 'react-native-svg';
import {GenericSectionItem} from '@atb/components/sections';
import {useRemoteConfigContext} from '@atb/modules/remote-config';
import {AbtBarcodeInspectionView} from '@entur-private/react-native-abt';
import {giveFocus} from '@atb/utils/use-focus-on-load';
import {
  BottomSheetHeaderType,
  BottomSheetModal,
  BottomSheetModalMethods,
} from '@atb/components/bottom-sheet';
import {Loading} from '@atb/components/loading';
import {useScreenshotAware} from 'react-native-screenshot-aware';
import {SessionReplayMask} from '@atb/modules/analytics';
import {useBarcodeInspection} from './use-barcode-inspection';

type Props = {
  validityStatus: ValidityStatus;
  fc: FareContractType;
};

export function Barcode({validityStatus, fc}: Props): React.JSX.Element | null {
  const {t} = useTranslation();
  const isFocusedAndActive = useIsFocusedAndActive();
  const styles = useStyles();

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

  return (
    <SessionReplayMask style={styles.sessionReplayMask}>
      <BarcodeContent fc={fc} />
    </SessionReplayMask>
  );
}

const BarcodeContent = ({fc}: {fc: FareContractType}) => {
  const {mobileTokenStatus} = useMobileTokenContext();

  switch (mobileTokenStatus) {
    case 'loading':
      return <LoadingBarcode />;
    case 'fallback':
      return <StaticAztec fc={fc} />;
    case 'staticQr':
      return <StaticQrCode fc={fc} />;
    case 'success-and-inspectable':
      return <BarcodeInspectionView fc={fc} />;
    case 'success-not-inspectable':
      return <DeviceNotInspectable />;
    case 'error':
      return <BarcodeError />;
  }
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

const BarcodeInspectionView = ({fc}: {fc: FareContractType}) => {
  const styles = useStyles();
  const {t} = useTranslation();
  const {enable_new_token_barcode_base64} = useRemoteConfigContext();
  const isFocusedAndActive = useIsFocusedAndActive();
  const hasInspectionError = useBarcodeInspection(
    isFocusedAndActive,
    enable_new_token_barcode_base64,
  );

  // Without an inspection the view shows no barcode, so show the static one
  if (hasInspectionError) return <StaticAztec fc={fc} />;

  return (
    <View style={styles.barcodeInspectionContainer}>
      <View
        style={styles.barcodeInspection}
        accessible={true}
        accessibilityLabel={t(FareContractTexts.details.barcodeA11yLabel)}
        testID="mobileTokenBarcode"
      >
        <SecureView>
          <AbtBarcodeInspectionView sizeInCm={3.5} />
        </SecureView>
      </View>
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
        <NativeTouchable
          variant="block"
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
        </NativeTouchable>
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
        <NativeTouchable
          variant="block"
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
        </NativeTouchable>
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
  sessionReplayMask: {
    flex: 1,
  },
  aztecCode: {
    width: '100%',
    aspectRatio: 1,
    backgroundColor: '#FFFFFF',
    padding: 20,
    // Limit the width, not the height, so the box stays square and the code
    // fills it, centered
    maxWidth: 275,
    alignSelf: 'center',
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
      <SessionReplayMask style={styles.staticBottomContainer}>
        <View style={[styles.aztecCode, styles.staticQrCode]}>
          <NativeTouchable
            variant="block"
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
          </NativeTouchable>
        </View>
      </SessionReplayMask>
    </BottomSheetModal>
  );
};
