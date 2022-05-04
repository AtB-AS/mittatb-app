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
import {TravelToken} from '@atb/mobile-token/types';

type Props = {
  validityStatus: ValidityStatus;
};

export default function QrCode({validityStatus}: Props) {
  const {tokenStatus, travelTokens, generateQrCode, retry} =
    useMobileTokenContextState();

  if (validityStatus !== 'valid') return null;
  if (!generateQrCode) return null;

  if (!travelTokens) {
    return <QrCodeLoading />;
  }

  const inspectableToken = travelTokens.find((t) => t.inspectable);

  if (inspectableToken?.isThisDevice) {
    return <QrCodeSvg generateQrCode={generateQrCode} />;
  } else if (inspectableToken) {
    return <QrCodeDeviceNotInspectable inspectableToken={inspectableToken} />;
  } else if (tokenStatus?.visualState === 'MissingNetConnection') {
    return <QrCodeMissingNetwork />;
  } else if (tokenStatus?.visualState === 'Error') {
    return <QrCodeError retry={retry} />;
  } else {
    return <QrCodeLoading />;
  }
}

const UPDATE_INTERVAL = 10000;

const QrCodeSvg = ({
  generateQrCode,
}: {
  generateQrCode: () => Promise<string | undefined>;
}) => {
  const styles = useStyles();
  const {t} = useTranslation();
  const [qrCodeError, setQrCodeError] = useState(false);
  const qrCode = useQrCode(generateQrCode, setQrCodeError, UPDATE_INTERVAL);
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
  generateQrCode: () => Promise<string | undefined>,
  setQrCodeError: (isError: boolean) => void,
  interval: number,
) => {
  const [tokenQRCode, setTokenQRCode] = useState<string | undefined>(undefined);

  const updateQrCode = useCallback(
    () =>
      generateQrCode().then((qr) => {
        if (!qr) {
          setQrCodeError(true);
        } else {
          setQrCodeError(false);
          setTokenQRCode(qr);
        }
      }),
    [generateQrCode, setTokenQRCode],
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
  inspectableToken: TravelToken;
}) => {
  const {t} = useTranslation();
  const message =
    inspectableToken.type === 'travelCard'
      ? t(TicketTexts.details.qrCodeErrors.notInspectableDevice.tCard)
      : t(
          TicketTexts.details.qrCodeErrors.notInspectableDevice.wrongDevice(
            inspectableToken.name ||
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

const QrCodeMissingNetwork = () => {
  const {t} = useTranslation();

  return (
    <Sections.GenericItem>
      <MessageBox
        type={'warning'}
        title={t(TicketTexts.details.qrCodeErrors.missingNetwork.title)}
        message={t(TicketTexts.details.qrCodeErrors.missingNetwork.text)}
      />
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
