import {FareContract} from '@atb/ticketing';
import {TicketingTexts, useTranslation} from '@atb/translations';
import * as Sections from '@atb/components/sections';
import ValidityLine from '@atb/screens/Ticketing/FareContracts/ValidityLine';
import ThemeText from '@atb/components/text';
import React from 'react';

export function UnknownFareContractDetails({fc}: {fc: FareContract}) {
  const {t} = useTranslation();
  return (
    <Sections.Section withBottomPadding>
      <Sections.GenericItem>
        <ValidityLine status="unknown" />
      </Sections.GenericItem>
      <Sections.GenericItem>
        <ThemeText>{t(TicketingTexts.details.orderId(fc.orderId))}</ThemeText>
      </Sections.GenericItem>
    </Sections.Section>
  );
}
