import {ValidityStatus} from '@atb/screens/Ticketing/Ticket/utils';
import {TokenStatus} from '@entur/react-native-traveller/lib/typescript/token/types';
import * as Sections from '@atb/components/sections';
import {ActivityIndicator, View} from 'react-native';
import {TicketTexts, useTranslation} from '@atb/translations';
import {SvgXml} from 'react-native-svg';
import React, {useCallback, useEffect, useState} from 'react';
import {StyleSheet, useTheme} from '@atb/theme';
import {useMobileContextState} from '@atb/mobile-token/MobileTokenContext';
import qrcode from 'qrcode';
import useInterval from '@atb/utils/use-interval';
import ThemeText from '@atb/components/text';

type Props = {
  validityStatus: ValidityStatus;
  isInspectable: boolean;
};

export default function QrCodeSvg({validityStatus, isInspectable}: Props) {
  const {t} = useTranslation();
  const styles = useStyles();
  const {theme} = useTheme();
  const {generateQrCode, tokenStatus} = useMobileContextState();
  const qrCode = useQrCode(generateQrCode, tokenStatus);
  const qrCodeSvg = useQrCodeSvg(qrCode);

  if (validityStatus !== 'valid') return null;
  if (!isInspectable) return null;
  if (!qrCodeSvg) return null;

  if (tokenStatus?.state === 'Valid' || tokenStatus?.state === 'Validating') {
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
  } else if (tokenStatus?.error) {
    return (
      <Sections.GenericItem>
        <ThemeText>Error creating mobile token</ThemeText>
      </Sections.GenericItem>
    );
  } else {
    return (
      <Sections.GenericItem>
        <ActivityIndicator animating={true} color={theme.text.colors.primary} />
      </Sections.GenericItem>
    );
  }
}

const useQrCodeSvg = (qrCode: string | undefined) => {
  const [qrCodeSvg, setQrCodeSvg] = useState<string | undefined>();

  useEffect(() => {
    (async function () {
      if (!qrCode) return;
      const svg = await qrcode.toString(qrCode, {
        type: 'svg',
      });

      setQrCodeSvg(svg);
    })();
  }, [qrCode]);
  return qrCodeSvg;
};

const useQrCode = (
  generateQrCode: () => Promise<string>,
  tokenStatus?: TokenStatus,
) => {
  const [tokenQRCode, setTokenQRCode] = useState<string | undefined>(undefined);

  const updateQrCode = useCallback(async () => {
    if (tokenStatus?.state === 'Valid') {
      const qr = await generateQrCode();
      setTokenQRCode(qr);
    } else {
      setTokenQRCode(undefined);
    }
  }, [tokenStatus]);

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

const useStyles = StyleSheet.createThemeHook(() => ({
  qrCode: {
    width: '100%',
    aspectRatio: 1,
  },
}));
