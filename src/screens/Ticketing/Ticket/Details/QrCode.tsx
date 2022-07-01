import {ValidityStatus} from '@atb/screens/Ticketing/Ticket/utils';
import * as Sections from '@atb/components/sections';
import {ActivityIndicator, View} from 'react-native';
import {TicketTexts, useTranslation} from '@atb/translations';
import {SvgXml} from 'react-native-svg';
import React, {useCallback, useEffect, useState} from 'react';
import {StyleSheet, useTheme} from '@atb/theme';
import {
  useHasEnabledMobileToken,
  useMobileTokenContextState,
} from '@atb/mobile-token/MobileTokenContext';
import qrcode from 'qrcode';
import useInterval from '@atb/utils/use-interval';
import MessageBox from '@atb/components/message-box';
import ThemeText from '@atb/components/text';
import {
  findInspectable,
  getDeviceName,
  isTravelCardToken,
} from '@atb/mobile-token/utils';
import {FareContract} from '@atb/tickets';

type Props = {
  validityStatus: ValidityStatus;
  ticketIsInspectable: boolean;
  fc: FareContract;
};

export default function QrCode({
  validityStatus,
  ticketIsInspectable,
  fc,
}: Props): JSX.Element | null {
  const status = useQrCodeStatus(validityStatus, ticketIsInspectable);

  switch (status) {
    case 'none':
      return null;
    case 'loading':
      return <LoadingQr />;
    case 'static':
      return <StaticQr fc={fc} />;
    case 'mobiletoken':
      return <MobileTokenQr fc={fc} />;
    case 'other':
      return <DeviceNotInspectable />;
  }
}

const useQrCodeStatus = (
  validityStatus: ValidityStatus,
  ticketIsInspectable: boolean,
) => {
  const {remoteTokens, deviceIsInspectable, isLoading, isError} =
    useMobileTokenContextState();
  const mobileTokenEnabled = useHasEnabledMobileToken();

  if (!ticketIsInspectable) return 'none';
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
 * Show qr code for mobile token. This can also fallback to static qr if
 * anything goes wrong when getting the signed mobile token.
 */
const MobileTokenQr = ({fc}: {fc: FareContract}) => {
  const styles = useStyles();
  const {t} = useTranslation();
  const {getSignedToken} = useMobileTokenContextState();
  const [qrCodeError, setQrCodeError] = useState(false);
  const qrCode = useQrCode(getSignedToken, setQrCodeError, UPDATE_INTERVAL);
  const [qrCodeSvg, setQrCodeSvg] = useState<string>();
  const [countdown, setCountdown] = useState<number>(UPDATE_INTERVAL / 1000);

  useEffect(() => {
    if (qrCode) {
      qrcode.toString(qrCode, {type: 'svg'}).then(setQrCodeSvg);
      setCountdown(UPDATE_INTERVAL / 1000);
    }
  }, [qrCode, setQrCodeSvg]);

  useInterval(
    () => {
      if (countdown > 0) {
        setCountdown(countdown - 1);
      }
    },
    1000,
    [],
    countdown === 0,
  );

  if (qrCodeError) {
    return <StaticQr fc={fc} />;
  } else if (!qrCodeSvg) {
    return <LoadingQr />;
  }

  return (
    <Sections.GenericItem>
      <View style={{alignItems: 'center'}}>
        <View
          style={styles.qrCode}
          accessible={true}
          accessibilityLabel={t(TicketTexts.details.qrCodeA11yLabel)}
          testID="mobileTokenQRCode"
        >
          <SvgXml xml={qrCodeSvg} width="100%" height="100%" />
        </View>
        <ThemeText>
          {t(TicketTexts.details.qrCodeCountdown(countdown))}
        </ThemeText>
      </View>
    </Sections.GenericItem>
  );
};

const useQrCode = (
  getSignedToken: () => Promise<string | undefined>,
  setQrCodeError: (isError: boolean) => void,
  interval: number,
) => {
  const [tokenQRCode, setTokenQRCode] = useState<string | undefined>(undefined);

  const updateQrCode = useCallback(
    () =>
      getSignedToken().then((qr) => {
        if (!qr) {
          setQrCodeError(true);
        } else {
          setQrCodeError(false);
          setTokenQRCode(qr);
        }
      }),
    [getSignedToken, setTokenQRCode],
  );

  useEffect(() => {
    updateQrCode();
  }, []);

  useInterval(
    () => {
      updateQrCode();
    },
    interval,
    [],
  );

  return tokenQRCode;
};

// const QrCodeError = ({retry}: {retry?: (forceRestart: boolean) => void}) => {
//   const {t} = useTranslation();
//
//   return (
//     <Sections.GenericItem>
//       <MessageBox
//         type={'error'}
//         title={t(TicketTexts.details.qrCodeErrors.generic.title)}
//         message={t(TicketTexts.details.qrCodeErrors.generic.text)}
//         onPress={retry && (() => retry(true))}
//         onPressText={retry && t(TicketTexts.details.qrCodeErrors.generic.retry)}
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
    ? t(TicketTexts.details.qrCodeErrors.notInspectableDevice.tCard)
    : t(
        TicketTexts.details.qrCodeErrors.notInspectableDevice.wrongDevice(
          getDeviceName(inspectableToken) ||
            t(
              TicketTexts.details.qrCodeErrors.notInspectableDevice
                .unnamedDevice,
            ),
        ),
      );
  return (
    <Sections.GenericItem>
      <MessageBox
        type={'warning'}
        title={t(TicketTexts.details.qrCodeErrors.notInspectableDevice.title)}
        message={message}
        isMarkdown={true}
      />
    </Sections.GenericItem>
  );
};

const LoadingQr = () => {
  const {theme} = useTheme();
  return (
    <Sections.GenericItem>
      <View style={{flex: 1}}>
        <ActivityIndicator animating={true} color={theme.text.colors.primary} />
      </View>
    </Sections.GenericItem>
  );
};

const StaticQr = ({fc}: {fc: FareContract}) => {
  const styles = useStyles();
  const {t} = useTranslation();
  const [qrCodeSvg, setQrCodeSvg] = useState<string>();

  useEffect(() => {
    if (fc.qrCode) {
      qrcode.toString(fc.qrCode, {type: 'svg'}).then(setQrCodeSvg);
    }
  }, [fc.qrCode, setQrCodeSvg]);

  if (!qrCodeSvg) return null;

  return (
    <Sections.GenericItem>
      <View
        style={styles.qrCode}
        accessible={true}
        accessibilityLabel={t(TicketTexts.details.qrCodeA11yLabel)}
        testID="staticQRCode"
      >
        <SvgXml xml={qrCodeSvg} width="100%" height="100%" />
      </View>
    </Sections.GenericItem>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  qrCode: {
    width: '100%',
    aspectRatio: 1,
    marginBottom: theme.spacings.medium,
  },
}));
