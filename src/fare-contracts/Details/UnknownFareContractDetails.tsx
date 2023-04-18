import {FareContract} from '@atb/ticketing';
import {FareContractTexts, useTranslation} from '@atb/translations';
import * as Sections from '@atb/components/sections';
import {ValidityLine} from '@atb/fare-contracts/ValidityLine';
import {ThemeText} from '@atb/components/text';
import React from 'react';

export function UnknownFareContractDetails({fc}: {fc: FareContract}) {
  const {t} = useTranslation();
  return (
    <Sections.Section withBottomPadding>
      <Sections.GenericSectionItem>
        <ValidityLine status="unknown" />
      </Sections.GenericSectionItem>
      <Sections.GenericSectionItem>
        <ThemeText>
          {t(FareContractTexts.details.orderId(fc.orderId))}
        </ThemeText>
      </Sections.GenericSectionItem>
    </Sections.Section>
  );
}
