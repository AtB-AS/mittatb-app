import {ValidityStatus} from '@atb/screens/Ticketing/Ticket/utils';
import * as Sections from '@atb/components/sections';
import {View} from 'react-native';
import {TicketTexts, useTranslation} from '@atb/translations';
import {SvgXml} from 'react-native-svg';
import React, {useEffect, useState} from 'react';
import {StyleSheet} from '@atb/theme';
import qrcode from 'qrcode';
import {FareContract} from '@atb/tickets';

type Props = {
  validityStatus: ValidityStatus;
  isInspectable: boolean;
  fc: FareContract;
};

export default function PaperQrCode({
  validityStatus,
  isInspectable,
  fc,
}: Props) {
  const styles = useStyles();
  const {t} = useTranslation();
  const [qrCodeSvg, setQrCodeSvg] = useState<string>();

  useEffect(() => {
    if (fc.qrCode) {
      qrcode.toString(fc.qrCode, {type: 'svg'}).then(setQrCodeSvg);
    }
  }, [fc.qrCode, setQrCodeSvg]);

  if (validityStatus !== 'valid') return null;
  if (!isInspectable) return null;
  if (!qrCodeSvg) return null;

  return (
    <Sections.GenericItem>
      <View
        style={styles.qrCode}
        accessible={true}
        accessibilityLabel={t(TicketTexts.details.qrCodeA11yLabel)}
        testID="paperQRCode"
      >
        <SvgXml xml={qrCodeSvg} width="100%" height="100%" />
      </View>
    </Sections.GenericItem>
  );
}

const useStyles = StyleSheet.createThemeHook(() => ({
  qrCode: {
    width: '100%',
    aspectRatio: 1,
  },
}));
