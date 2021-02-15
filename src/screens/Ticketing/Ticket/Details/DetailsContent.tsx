import * as Sections from '@atb/components/sections';
import ThemeText from '@atb/components/text';
import {StyleSheet} from '@atb/theme';
import {
  FareContract,
  FareContractState,
  isPreactivatedTicket,
} from '@atb/tickets';
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
  const {t, language} = useTranslation();
  const styles = useStyles();
  const qrCodeSvg = useQrCode(fc);

  const firstTravelRight = fc.travelRights[0];
  if (isPreactivatedTicket(firstTravelRight)) {
    const validFrom = firstTravelRight.startDateTime.toMillis();
    const validTo = firstTravelRight.endDateTime.toMillis();
    const isNotExpired = validTo >= now;
    const isRefunded = fc.state === FareContractState.Refunded;
    const isValidTicket = isNotExpired && !isRefunded;

    return (
      <Sections.Section withBottomPadding>
        <Sections.GenericItem>
          <ValidityHeader
            isValid={isValidTicket}
            isNotExpired={isNotExpired}
            isRefunded={isRefunded}
            now={now}
            validTo={validTo}
          />
          {isValidTicket ? (
            <ValidityLine
              status="valid"
              now={now}
              validFrom={validFrom}
              validTo={validTo}
            />
          ) : (
            <ValidityLine status="expired" />
          )}
          <TicketInfo
            travelRights={fc.travelRights.filter(isPreactivatedTicket)}
          />
        </Sections.GenericItem>
        <Sections.GenericItem>
          <ThemeText>{t(TicketTexts.details.orderId(fc.orderId))}</ThemeText>
          <ThemeText type="lead" color="faded">
            {t(
              TicketTexts.details.purchaseTime(
                formatToLongDateTime(fromUnixTime(validFrom / 1000), language),
              ),
            )}
          </ThemeText>
        </Sections.GenericItem>
        <Sections.LinkItem
          text={t(TicketTexts.details.askForRefund)}
          disabled
        />
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
  } else {
    return <UnknownTicketDetails fc={fc} />;
  }
};

function UnknownTicketDetails({fc}: {fc: FareContract}) {
  const {t} = useTranslation();
  return (
    <Sections.Section withBottomPadding>
      <Sections.GenericItem>
        <ValidityLine status="unknown" />
      </Sections.GenericItem>
      <Sections.GenericItem>
        <ThemeText>{t(TicketTexts.details.orderId(fc.orderId))}</ThemeText>
      </Sections.GenericItem>
    </Sections.Section>
  );
}

const useQrCode = (fc: FareContract) => {
  const [qrCodeSvg, setQrCodeSvg] = useState<string | undefined>();

  useEffect(() => {
    (async function () {
      if (!fc?.qrCode) return;
      const svg = await qrcode.toString(fc.qrCode, {
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
