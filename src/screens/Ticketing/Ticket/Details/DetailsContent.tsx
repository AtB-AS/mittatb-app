import {FareContract, FareContractLifecycleState} from '@atb/api/fareContracts';
import * as Sections from '@atb/components/sections';
import ThemeText from '@atb/components/text';
import {StyleSheet} from '@atb/theme';
import {TicketTexts, useTranslation} from '@atb/translations';
import {formatToLongDateTime} from '@atb/utils/date';
import {fromUnixTime} from 'date-fns';
import qrcode from 'qrcode';
import React, {useEffect, useState} from 'react';
import {View} from 'react-native';
import {SvgXml} from 'react-native-svg';
import TicketInfo from '../TicketInfo';
import ValidityHeader from '../ValidityHeader';
import ValidityLine from '../ValidityLine';

type Props = {
  fareContract: FareContract;
  now: number;
  onReceiptNavigate: () => void;
};

const DetailsContent: React.FC<Props> = ({
  fareContract: fc,
  now,
  onReceiptNavigate,
}) => {
  const nowSeconds = now / 1000;
  const isNotExpired = fc.usage_valid_to >= nowSeconds;
  const isRefunded = fc.state === FareContractLifecycleState.Refunded;
  const isValidTicket = isNotExpired && !isRefunded;
  const {t, language} = useTranslation();
  const styles = useStyles();
  const qrCodeSvg = useQrCode(fc);

  return (
    <Sections.Section withBottomPadding>
      <Sections.GenericItem>
        <ValidityHeader
          isValid={isValidTicket}
          isNotExpired={isNotExpired}
          isRefunded={isRefunded}
          nowSeconds={nowSeconds}
          validTo={fc.usage_valid_to}
        />
        {isValidTicket ? (
          <ValidityLine
            status="valid"
            nowSeconds={nowSeconds}
            validFrom={fc.usage_valid_from}
            validTo={fc.usage_valid_to}
          />
        ) : (
          <ValidityLine status="expired" />
        )}
        <TicketInfo fareContract={fc} />
      </Sections.GenericItem>
      <Sections.GenericItem>
        <ThemeText>{t(TicketTexts.details.orderId(fc.order_id))}</ThemeText>
        <ThemeText type="lead" color="faded">
          {t(
            TicketTexts.details.purchaseTime(
              formatToLongDateTime(fromUnixTime(fc.usage_valid_from), language),
            ),
          )}
        </ThemeText>
      </Sections.GenericItem>
      <Sections.LinkItem text={t(TicketTexts.details.askForRefund)} disabled />
      <Sections.LinkItem
        text={t(TicketTexts.details.askForReceipt)}
        onPress={onReceiptNavigate}
      />
      {isValidTicket && qrCodeSvg && (
        <Sections.GenericItem>
          <View style={styles.qrCode}>
            <SvgXml xml={qrCodeSvg} width="100%" height="100%" />
          </View>
        </Sections.GenericItem>
      )}
    </Sections.Section>
  );
};

const useQrCode = (fc: FareContract) => {
  const [qrCodeSvg, setQrCodeSvg] = useState<string | undefined>();

  useEffect(() => {
    (async function () {
      if (!fc?.qr_code) return;
      const svg = await qrcode.toString(fc.qr_code, {
        type: 'svg',
      });

      setQrCodeSvg(svg);
    })();
  }, [fc]);
  return qrCodeSvg;
};

const useStyles = StyleSheet.createThemeHook(() => ({
  qrCode: {
    width: '100%',
    aspectRatio: 1,
  },
}));

export default DetailsContent;
