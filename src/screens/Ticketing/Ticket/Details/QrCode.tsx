import {ValidityStatus} from '@atb/screens/Ticketing/Ticket/utils';
import * as Sections from '@atb/components/sections';
import {ActivityIndicator, View} from 'react-native';
import {TicketTexts, useTranslation} from '@atb/translations';
import {SvgXml} from 'react-native-svg';
import React, {useCallback, useEffect, useState} from 'react';
import {StyleSheet, useTheme} from '@atb/theme';
import {useMobileContextState} from '@atb/mobile-token/MobileTokenContext';
import qrcode from 'qrcode';
import useInterval from '@atb/utils/use-interval';
import MessageBox from '@atb/components/message-box';

type Props = {
  validityStatus: ValidityStatus;
  isInspectable: boolean;
};

export default function QrCode({validityStatus, isInspectable}: Props) {
  const {tokenStatus, generateQrCode} = useMobileContextState();

  if (validityStatus !== 'valid') return null;
  if (!isInspectable) return null;
  if (!generateQrCode) return null;

  switch (tokenStatus?.visualState) {
    case 'Token':
      return <QrCodeSvg generateQrCode={generateQrCode} />;
    case 'Error':
      return <QrCodeError />;
    case 'MissingNetConnection':
      return <QrCodeMissingNetwork />;
    case 'Loading':
    case undefined:
      return <QrCodeLoading />;
  }
}

const QrCodeSvg = ({
  generateQrCode,
}: {
  generateQrCode: () => Promise<string>;
}) => {
  const styles = useStyles();
  const {t} = useTranslation();
  const qrCode = useQrCode(generateQrCode);
  const [qrCodeSvg, setQrCodeSvg] = useState<string>();

  useEffect(() => {
    if (qrCode) {
      qrcode.toString(qrCode, {type: 'svg'}).then(setQrCodeSvg);
    }
  }, [qrCode, setQrCodeSvg]);

  if (!qrCodeSvg) {
    return <QrCodeError />;
  }

  return (
    <Sections.GenericItem>
      <View
        style={styles.qrCode}
        accessible={true}
        accessibilityLabel={t(TicketTexts.details.qrCodeA11yLabel)}
      >
        <SvgXml xml={qrCodeSvg} width="100%" height="100%" />
      </View>
    </Sections.GenericItem>
  );
};

const useQrCode = (generateQrCode: () => Promise<string>) => {
  const [tokenQRCode, setTokenQRCode] = useState<string | undefined>(undefined);

  const updateQrCode = useCallback(
    () => generateQrCode().then(setTokenQRCode),
    [generateQrCode, setTokenQRCode],
  );

  useEffect(() => {
    updateQrCode();
  }, []);

  // TODO: Maybe update so this happens in TicketContext later? Just proof-of-concept
  useInterval(
    () => {
      updateQrCode();
    },
    10000,
    [],
  );

  return tokenQRCode;
};

const QrCodeError = () => (
  <Sections.GenericItem>
    <MessageBox
      type={'warning'}
      title="En feil har oppstått"
      message={'Får ikke generert QR-kode.'}
    />
  </Sections.GenericItem>
);

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

const QrCodeMissingNetwork = () => (
  <Sections.GenericItem>
    <MessageBox
      type={'warning'}
      title="Mangler nettilgang"
      message={
        'Får ikke hentet QR-kode uten tilgang på nett. Sjekk om du har skrudd på mobildata.'
      }
    />
  </Sections.GenericItem>
);

const useStyles = StyleSheet.createThemeHook(() => ({
  qrCode: {
    width: '100%',
    aspectRatio: 1,
  },
}));
