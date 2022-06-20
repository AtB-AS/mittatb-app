import {ValidityStatus} from '@atb/screens/Ticketing/Ticket/utils';
import * as Sections from '@atb/components/sections';
import {ActivityIndicator, View} from 'react-native';
import {TicketTexts, useTranslation} from '@atb/translations';
import {SvgXml} from 'react-native-svg';
import React, {useCallback, useEffect, useState} from 'react';
import {StyleSheet, useTheme} from '@atb/theme';
import {useMobileTokenContextState} from '@atb/mobile-token/MobileTokenContext';
import qrcode from 'qrcode';
import useInterval from '@atb/utils/use-interval';
import MessageBox from '@atb/components/message-box';
import ThemeText from '@atb/components/text';
import {findInspectable, getDeviceName} from '@atb/mobile-token/utils';
import {RemoteToken} from '@atb/mobile-token/types';

type Props = {
  validityStatus: ValidityStatus;
};

export default function QrCode({validityStatus}: Props) {
  const {remoteTokens, deviceIsInspectable, isLoading, isError, retry} =
    useMobileTokenContextState();

  if (validityStatus !== 'valid') return null;

  if (isLoading) return <QrCodeLoading />;
  if (isError) return <QrCodeError retry={retry} />;
  if (deviceIsInspectable) return <QrCodeSvg />;

  const inspectableToken = findInspectable(remoteTokens);
  if (inspectableToken) {
    return <QrCodeDeviceNotInspectable inspectableToken={inspectableToken} />;
  }

  return <QrCodeError retry={retry} />;
}

const UPDATE_INTERVAL = 10000;

const QrCodeSvg = () => {
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
    return <QrCodeError />;
  } else if (!qrCodeSvg) {
    return <QrCodeLoading />;
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
const QrCodeError = ({retry}: {retry?: (forceRestart: boolean) => void}) => {
  const {t} = useTranslation();

  return (
    <Sections.GenericItem>
      <MessageBox
        type={'error'}
        title={t(TicketTexts.details.qrCodeErrors.generic.title)}
        message={t(TicketTexts.details.qrCodeErrors.generic.text)}
        onPress={retry && (() => retry(true))}
        onPressText={retry && t(TicketTexts.details.qrCodeErrors.generic.retry)}
      />
    </Sections.GenericItem>
  );
};
const QrCodeDeviceNotInspectable = ({
  inspectableToken,
}: {
  inspectableToken: RemoteToken;
}) => {
  const {t} = useTranslation();
  const message =
    inspectableToken.type === 'travelCard'
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

const QrCodeLoading = () => {
  const {theme} = useTheme();
  return (
    <Sections.GenericItem>
      <View style={{flex: 1}}>
        <ActivityIndicator animating={true} color={theme.text.colors.primary} />
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
