import React from 'react';
import {
  FareContractState,
  FareContract,
  isPreactivatedTicket,
} from '../../../api/fareContracts';
import * as Sections from '../../../components/sections';
import ValidityHeader from './ValidityHeader';
import ValidityLine from './ValidityLine';
import {TicketTexts, useTranslation} from '../../../translations';
import TicketInfo from './TicketInfo';
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

  const firstTravelRight = fc.travelRights[0];
  if (isPreactivatedTicket(firstTravelRight)) {
    const {startDateTime, endDateTime} = firstTravelRight;
    const validTo = endDateTime.getTime();
    const validFrom = startDateTime.getTime();
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
    return <UnknownTicket />;
  }
};

function UnknownTicket() {
  return (
    <Sections.Section withBottomPadding>
      <Sections.GenericItem>
        <ValidityLine status="unknown" />
      </Sections.GenericItem>
    </Sections.Section>
  );
}

export default SimpleTicket;
