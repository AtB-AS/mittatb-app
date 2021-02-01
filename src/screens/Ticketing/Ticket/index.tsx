import React from 'react';
import {
  FareContract,
  FareContractLifecycleState,
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
  onPressInspection: () => void;
};

const SimpleTicket: React.FC<Props> = ({
  fareContract: fc,
  now,
  onPressDetails,
  onPressInspection,
}) => {
  const nowSeconds = now / 1000;
  const isNotExpired = fc.usage_valid_to >= nowSeconds;
  const isRefunded = fc.state === FareContractLifecycleState.Refunded;
  const isValidTicket = isNotExpired && !isRefunded;
  const {t} = useTranslation();

  return (
    <Sections.Section withBottomPadding>
      <Sections.GenericItem>
        <ValidityHeader
          isValid={isValidTicket}
          nowSeconds={nowSeconds}
          validTo={fc.usage_valid_to}
          isNotExpired={isNotExpired}
          isRefunded={isRefunded}
          onPressDetails={onPressDetails}
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
      {isValidTicket && (
        <Sections.LinkItem
          text={t(TicketTexts.controlLink)}
          onPress={onPressInspection}
          disabled={!fc.qr_code}
        />
      )}
    </Sections.Section>
  );
};

export default SimpleTicket;
