import * as Sections from '@atb/components/sections';
import ThemeText from '@atb/components/text';
import {FareContract, isInspectable, isPreactivatedTicket} from '@atb/tickets';
import {TicketTexts, useTranslation} from '@atb/translations';
import {formatToLongDateTime} from '@atb/utils/date';
import {fromUnixTime} from 'date-fns';
import React from 'react';
import {View} from 'react-native';
import TicketInfo from '../TicketInfo';
import ValidityHeader from '../ValidityHeader';
import ValidityLine from '../ValidityLine';
import {getValidityStatus} from '@atb/screens/Ticketing/Ticket/utils';
import QrCode from '@atb/screens/Ticketing/Ticket/Details/QrCode';
import {
  useHasEnabledMobileToken,
  useMobileTokenContextState,
} from '@atb/mobile-token/MobileTokenContext';

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
  const hasEnabledMobileToken = useHasEnabledMobileToken();
  const {
    deviceIsInspectable,
    isError: mobileTokenError,
    fallbackEnabled,
  } = useMobileTokenContextState();

  const firstTravelRight = fc.travelRights[0];
  if (isPreactivatedTicket(firstTravelRight)) {
    const validFrom = firstTravelRight.startDateTime.toMillis();
    const validTo = firstTravelRight.endDateTime.toMillis();
    const inspectable = isInspectable(
      firstTravelRight,
      hasActiveTravelCard,
      hasEnabledMobileToken,
      deviceIsInspectable,
      mobileTokenError,
      fallbackEnabled,
    );

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
            isInspectable={inspectable}
          />
          <ValidityLine
            status={validityStatus}
            now={now}
            validFrom={validFrom}
            validTo={validTo}
            isInspectable={inspectable}
          />
          <TicketInfo
            travelRights={fc.travelRights.filter(isPreactivatedTicket)}
            status={validityStatus}
            isInspectable={inspectable}
            testID={'details'}
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
          testID="receiptButton"
        />
        <QrCode
          validityStatus={validityStatus}
          isInspectable={inspectable}
          fc={fc}
        />
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

export default DetailsContent;
