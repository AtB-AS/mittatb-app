import React from 'react';
import {
  FareContract,
  FareContractLifecycleState,
} from '../../../../api/fareContracts';
import ThemeText from '../../../../components/text';
import * as Sections from '../../../../components/sections';
import ValidityHeader from '../ValidityHeader';
import ValidityLine from '../ValidityLine';
import {formatToLongDateTime} from '../../../../utils/date';
import {fromUnixTime} from 'date-fns';
import {TicketTexts, useTranslation} from '../../../../translations';

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
        <ValidityLine
          isValid={isValidTicket}
          nowSeconds={nowSeconds}
          validFrom={fc.usage_valid_from}
          validTo={fc.usage_valid_to}
        />
        <ThemeText>
          {/*Todo: Should use user profile names*/}
          {t(TicketTexts.ticketsSummary(fc.user_profiles.length))}
        </ThemeText>
        <ThemeText type="lead" color="faded">
          {fc.product_name}
        </ThemeText>
        <ThemeText type="lead" color="faded">
          {
            // Hardcoded until API returns zone
            t(TicketTexts.zone('A'))
          }
        </ThemeText>
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
      {isValidTicket && (
        <Sections.LinkItem text={t(TicketTexts.controlLink)} disabled />
      )}
      <Sections.LinkItem text={t(TicketTexts.details.askForRefund)} disabled />
      <Sections.LinkItem
        text={t(TicketTexts.details.askForReceipt)}
        onPress={onReceiptNavigate}
      />
    </Sections.Section>
  );
};

export default DetailsContent;
