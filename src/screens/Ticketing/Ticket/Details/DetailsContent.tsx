import * as Sections from '@atb/components/sections';
import ThemeText from '@atb/components/text';
import {StyleSheet} from '@atb/theme';
import {FareContract, isPreactivatedTicket} from '@atb/tickets';
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
import {getValidityStatus} from '@atb/screens/Ticketing/Ticket/utils';
import {screenReaderPause} from '@atb/components/accessible-text';

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
  const qrCodeSvg = useQrCode(fc);

  const firstTravelRight = fc.travelRights[0];
  if (isPreactivatedTicket(firstTravelRight)) {
    const validFrom = firstTravelRight.startDateTime.toMillis();
    const validTo = firstTravelRight.endDateTime.toMillis();
    const isInspectable = !hasActiveTravelCard;

    const validityStatus = getValidityStatus(
      now,
      validFrom,
      validTo,
      fc.state,
      isInspectable,
    );

    const orderIdText = t(TicketTexts.details.orderId(fc.orderId));

    return (
      <Sections.Section withBottomPadding>
        <Sections.GenericItem>
          <ValidityHeader
            status={validityStatus}
            now={now}
            validFrom={validFrom}
            validTo={validTo}
          />
          <ValidityLine
            status={validityStatus}
            now={now}
            validFrom={validFrom}
            validTo={validTo}
          />
          <TicketInfo
            travelRights={fc.travelRights.filter(isPreactivatedTicket)}
            status={validityStatus}
            hasActiveTravelCard={hasActiveTravelCard}
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
        {validityStatus === 'valid' && qrCodeSvg && (
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
