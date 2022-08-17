import {FareContract} from '@atb/tickets';
import {TicketTexts, useTranslation} from '@atb/translations';
import * as Sections from '@atb/components/sections';
import ValidityLine from '@atb/screens/Ticketing/Ticket/ValidityLine';
import ThemeText from '@atb/components/text';
import React from 'react';

export function UnknownTicketDetails({fc}: {fc: FareContract}) {
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
