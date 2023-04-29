import {FareContract} from '@atb/ticketing';
import {FareContractTexts, useTranslation} from '@atb/translations';
import {ValidityLine} from '@atb/fare-contracts/ValidityLine';
import {ThemeText} from '@atb/components/text';
import React from 'react';
import {GenericSectionItem, Section} from '@atb/components/sections';

export function UnknownFareContractDetails({fc}: {fc: FareContract}) {
  const {t} = useTranslation();
  return (
    <Section withBottomPadding>
      <GenericSectionItem>
        <ValidityLine status="unknown" />
      </GenericSectionItem>
      <GenericSectionItem>
        <ThemeText>
          {t(FareContractTexts.details.orderId(fc.orderId))}
        </ThemeText>
      </GenericSectionItem>
    </Section>
  );
}
