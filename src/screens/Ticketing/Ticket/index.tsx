import React from 'react';
import * as Sections from '../../../components/sections';
import ValidityHeader from './ValidityHeader';
import ValidityLine from './ValidityLine';
import {TicketTexts, useTranslation} from '../../../translations';
import TicketInfo from './TicketInfo';
import ThemeText from '../../../components/text';
import {
  FareContract,
  FareContractState,
  isPreactivatedTicket,
} from '../../../tickets';

type Props = {
  fareContract: FareContract;
  now: number;
  onPressDetails: () => void;
};

const SimpleTicket: React.FC<Props> = ({
  fareContract: fc,
  now,
  onPressDetails,
}) => {
  const {t} = useTranslation();

  const firstTravelRight = fc.travelRights?.[0];
  if (isPreactivatedTicket(firstTravelRight)) {
    const {startDateTime, endDateTime} = firstTravelRight;
    const validTo = endDateTime.toMillis();
    const validFrom = startDateTime.toMillis();
    const isNotExpired = validTo >= now;
    const isRefunded = fc.state === FareContractState.Refunded;
    const isValidTicket = isNotExpired && !isRefunded;

    return (
      <Sections.Section withBottomPadding>
        <Sections.GenericItem>
          <ValidityHeader
            isValid={isValidTicket}
            now={now}
            validTo={validTo}
            isNotExpired={isNotExpired}
            isRefunded={isRefunded}
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
        <Sections.LinkItem
          text={t(
            isValidTicket
              ? TicketTexts.detailsLink.valid
              : TicketTexts.detailsLink.expired,
          )}
          onPress={onPressDetails}
        />
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
