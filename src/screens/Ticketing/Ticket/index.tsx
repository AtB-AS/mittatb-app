import * as Sections from '@atb/components/sections';
import ThemeText from '@atb/components/text';
import {FareContract, isPreactivatedTicket} from '@atb/tickets';
import {TicketTexts, useTranslation} from '@atb/translations';
import React from 'react';
import TicketInfo from './TicketInfo';
import ValidityHeader from './ValidityHeader';
import ValidityLine from './ValidityLine';
import {getValidityStatus} from '@atb/screens/Ticketing/Ticket/utils';

type Props = {
  fareContract: FareContract;
  now: number;
  hideDetails?: boolean;
  onPressDetails?: () => void;
  hasActiveTravelCard?: boolean;
};

const SimpleTicket: React.FC<Props> = ({
  fareContract: fc,
  now,
  hideDetails,
  onPressDetails,
  hasActiveTravelCard = false,
}) => {
  const {t} = useTranslation();

  const firstTravelRight = fc.travelRights?.[0];
  if (isPreactivatedTicket(firstTravelRight)) {
    const {startDateTime, endDateTime} = firstTravelRight;
    const validTo = endDateTime.toMillis();
    const validFrom = startDateTime.toMillis();
    const isInspectable =
      !hasActiveTravelCard &&
      firstTravelRight.type === 'PreActivatedSingleTicket';

    const validityStatus = getValidityStatus(
      now,
      validFrom,
      validTo,
      fc.state,
      isInspectable,
    );
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
        {!hideDetails && (
          <Sections.LinkItem
            text={t(
              validityStatus === 'valid' && isInspectable
                ? TicketTexts.detailsLink.valid
                : TicketTexts.detailsLink.notValid,
            )}
            onPress={onPressDetails}
          />
        )}
      </Sections.Section>
    );
  } else {
    return <UnknownTicket fc={fc} />;
  }
};

function UnknownTicket({fc}: {fc: FareContract}) {
  const {t} = useTranslation();

  return (
    <Sections.Section withBottomPadding>
      <Sections.GenericItem>
        <ValidityLine status="unknown" />
        <ThemeText>{t(TicketTexts.unknownTicket.message)}</ThemeText>
      </Sections.GenericItem>
      <Sections.GenericItem>
        <ThemeText>
          {t(TicketTexts.unknownTicket.orderId(fc.orderId))}
        </ThemeText>
      </Sections.GenericItem>
    </Sections.Section>
  );
}

export default SimpleTicket;
