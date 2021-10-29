import * as Sections from '@atb/components/sections';
import ThemeText from '@atb/components/text';
import {StyleSheet} from '@atb/theme';
import {FareContract, isPreactivatedTicket, useTicketState} from '@atb/tickets';
import {TicketTexts, useTranslation} from '@atb/translations';
import {formatToLongDateTime} from '@atb/utils/date';
import {fromUnixTime} from 'date-fns';
import qrcode from 'qrcode';
import React, {useCallback, useEffect, useState} from 'react';
import {View} from 'react-native';
import {SvgXml} from 'react-native-svg';
import TicketInfo from '../TicketInfo';
import ValidityHeader from '../ValidityHeader';
import ValidityLine from '../ValidityLine';
import {getValidityStatus} from '@atb/screens/Ticketing/Ticket/utils';
import useInterval from '@atb/utils/use-interval';

type Props = {
  fareContract: FareContract;
  now: number;
  onReceiptNavigate: () => void;
  hasActiveTravelCard?: boolean;
};

const DetailsContent: React.FC<Props> = ({
  fareContract: fc,
  now,
  onReceiptNavigate,
  hasActiveTravelCard = false,
}) => {
  const {t, language} = useTranslation();
  const styles = useStyles();
  const qrCode = useQrCode(fc);
  const qrCodeSvg = useQrCodeSvg(qrCode);

  const firstTravelRight = fc.travelRights[0];
  if (isPreactivatedTicket(firstTravelRight)) {
    const validFrom = firstTravelRight.startDateTime.toMillis();
    const validTo = firstTravelRight.endDateTime.toMillis();
    const isInspectable =
      !hasActiveTravelCard &&
      firstTravelRight.type === 'PreActivatedSingleTicket';

    const validityStatus = getValidityStatus(now, validFrom, validTo, fc.state);

    const orderIdText = t(TicketTexts.details.orderId(fc.orderId));

    return (
      <Sections.Section withBottomPadding>
        <Sections.GenericItem>
          <ValidityHeader
            status={validityStatus}
            now={now}
            validFrom={validFrom}
            validTo={validTo}
            isInspectable={isInspectable}
          />
          <ValidityLine
            status={validityStatus}
            now={now}
            validFrom={validFrom}
            validTo={validTo}
            isInspectable={isInspectable}
          />
          <TicketInfo
            travelRights={fc.travelRights.filter(isPreactivatedTicket)}
            status={validityStatus}
            hasActiveTravelCard={hasActiveTravelCard}
            isInspectable={isInspectable}
          />
        </Sections.GenericItem>
        <Sections.GenericItem>
          <View accessible={true}>
            <ThemeText accessibilityLabel={`${orderIdText},`}>
              {orderIdText}
            </ThemeText>
            <ThemeText type="body__secondary" color="secondary">
              {t(
                TicketTexts.details.purchaseTime(
                  formatToLongDateTime(
                    fromUnixTime(fc.created.toMillis() / 1000),
                    language,
                  ),
                ),
              )}
            </ThemeText>
          </View>
        </Sections.GenericItem>
        <Sections.LinkItem
          text={t(TicketTexts.details.askForReceipt)}
          onPress={onReceiptNavigate}
          accessibility={{accessibilityRole: 'button'}}
        />
        {validityStatus === 'valid' && isInspectable && qrCodeSvg && (
          <Sections.GenericItem>
            <View
              style={styles.qrCode}
              accessible={true}
              accessibilityLabel={t(TicketTexts.details.qrCodeA11yLabel)}
            >
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

const useQrCode = (fc: FareContract) => {
  const {tokenStatus, generateQrCode, retryTokenClient} = useTicketState();
  const [tokenQRCode, setTokenQRCode] = useState<string | undefined>(undefined);
  const [retryCount, setRetryCount] = useState(0);

  const updateQrCode = useCallback(async () => {
    if (tokenStatus?.state === 'Valid') {
      const qr = await generateQrCode();
      setTokenQRCode(qr);
    } else {
      setTokenQRCode(undefined);
    }
  }, [tokenStatus]);

  useInterval(
    () => {
      setRetryCount(retryCount + 1);
      retryTokenClient(false); // todo: better retry logic
    },
    5000,
    [retryTokenClient, tokenStatus?.error],
    !tokenStatus?.error || retryCount >= 5,
  );

  useInterval(
    () => {
      setRetryCount(retryCount + 1);
      retryTokenClient(true); // todo: better retry logic
    },
    30000,
    [retryTokenClient, tokenStatus?.error],
    !tokenStatus?.error || retryCount < 5,
  );

  useEffect(() => {
    updateQrCode();
  }, []);

  // TODO: Update so this happens in TicketContext later. Just proof-of-concept
  useInterval(
    () => {
      updateQrCode();
    },
    10000,
    [],
  );

  return tokenQRCode ?? fc.qrCode;
};

const useStyles = StyleSheet.createThemeHook(() => ({
  qrCode: {
    width: '100%',
    aspectRatio: 1,
  },
}));

export default DetailsContent;
