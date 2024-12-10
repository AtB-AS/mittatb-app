import DeviceBrightness from '@adrianso/react-native-device-brightness';
import {
  BottomSheetContainer,
  useBottomSheet,
} from '@atb/components/bottom-sheet';
import {MessageInfoBox} from '@atb/components/message-info-box';
import {ValidityStatus} from '@atb/fare-contracts/utils';
import {useMobileTokenContextState} from '@atb/mobile-token';
import {StyleSheet, useTheme} from '@atb/theme';
import {FareContract} from '@atb/ticketing';
import {FareContractTexts, useTranslation} from '@atb/translations';
import {useIsFocusedAndActive} from '@atb/utils/use-is-focused-and-active';
import Bugsnag from '@bugsnag/react-native';
import {renderAztec} from '@entur-private/abt-mobile-barcode-javascript-lib';
import QRCode from 'qrcode';
import React, {RefObject, useEffect, useRef, useState} from 'react';
import {ActivityIndicator, View} from 'react-native';
import {PressableOpacity} from '@atb/components/pressable-opacity';
import {SvgXml} from 'react-native-svg';
import {GenericSectionItem} from '@atb/components/sections';
import {useGetSignedTokenQuery} from '@atb/mobile-token/hooks/use-get-signed-token-query';

type Props = {
  validityStatus: ValidityStatus;
  fc: FareContract;
};

export function Barcode({validityStatus, fc}: Props): JSX.Element | null {
  const {mobileTokenStatus} = useMobileTokenContextState();
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
      return <MobileTokenAztec fc={fc} />;
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

/**
 * Show aztec code for mobile token. This can also fall back to static aztec if
 * anything goes wrong when getting the signed mobile token.
 */
const MobileTokenAztec = ({fc}: {fc: FareContract}) => {
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

const BarcodeError = () => {
  const {t} = useTranslation();
  const {retry} = useMobileTokenContextState();

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
  const {tokens} = useMobileTokenContextState();
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
  const {theme} = useTheme();
  return (
    <View style={{flex: 1}}>
      <ActivityIndicator
        animating={true}
        color={theme.color.foreground.dynamic.primary}
      />
    </View>
  );
};

const StaticAztec = ({fc}: {fc: FareContract}) => {
  const styles = useStyles();
  const {t} = useTranslation();
  const [aztecXml, setAztecXml] = useState<string>();
  const onCloseFocusRef = useRef<RefObject<any>>(null);
  const onOpenBarcodePress = useStaticBarcodeBottomSheet(
    aztecXml,
    onCloseFocusRef,
  );

  useEffect(() => {
    if (fc.qrCode) {
      setAztecXml(renderAztec(fc.qrCode));
    }
  }, [fc.qrCode, setAztecXml]);

  if (!aztecXml) return null;

  return (
    <View style={styles.aztecCode}>
      <PressableOpacity
        onPress={onOpenBarcodePress}
        accessibilityRole="button"
        accessibilityLabel={t(
          FareContractTexts.details.barcodeA11yLabelWithActivation,
        )}
        testID="staticBarcode"
        ref={onCloseFocusRef}
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
  const onCloseFocusRef = useRef<RefObject<any>>(null);
  const onOpenBarcodePress = useStaticBarcodeBottomSheet(
    qrCodeSvg,
    onCloseFocusRef,
  );

  useEffect(() => {
    if (fc.qrCode) {
      QRCode.toString(fc.qrCode, {type: 'svg'}).then(setQrCodeSvg);
    }
  }, [fc.qrCode, setQrCodeSvg]);

  if (!qrCodeSvg) return null;

  return (
    <View
      style={[styles.aztecCode, styles.staticQrCode, styles.staticQrCodeSmall]}
    >
      <PressableOpacity
        onPress={onOpenBarcodePress}
        accessibilityRole="button"
        accessibilityLabel={t(
          FareContractTexts.details.barcodeA11yLabelWithActivation,
        )}
        testID="staticQRCode"
        ref={onCloseFocusRef}
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
    padding: theme.spacing.large,
    backgroundColor: '#FFFFFF',
    maxHeight: 275,
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

function useStaticBarcodeBottomSheet(
  qrCodeSvg: string | undefined,
  onCloseFocusRef: RefObject<any>,
) {
  const styles = useStyles();
  const {t} = useTranslation();

  const {
    open: openBottomSheet,
    close: closeBottomSheet,
    onOpenFocusRef,
  } = useBottomSheet();

  const onOpenBarcodePress = () => {
    openBottomSheet(
      () => (
        <BottomSheetContainer
          title={t(FareContractTexts.details.bottomSheetTitle)}
          testID="barcodeBottomSheet"
          fullHeight
        >
          <View style={styles.staticBottomContainer}>
            <View style={[styles.aztecCode, styles.staticQrCode]}>
              <PressableOpacity
                ref={onOpenFocusRef}
                onPress={closeBottomSheet}
                accessible={true}
                accessibilityLabel={t(
                  FareContractTexts.details.barcodeBottomSheetA11yLabel,
                )}
                testID="staticBigQRCode"
              >
                <SvgXml xml={qrCodeSvg ?? ''} width="100%" height="100%" />
              </PressableOpacity>
            </View>
          </View>
        </BottomSheetContainer>
      ),
      onCloseFocusRef,
    );
  };

  return onOpenBarcodePress;
}
