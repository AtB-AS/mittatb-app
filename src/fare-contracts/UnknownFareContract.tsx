import {ThemeText} from '@atb/components/text';
import {FareContract} from '@atb/ticketing';
import {FareContractTexts, useTranslation} from '@atb/translations';
import React from 'react';
import {ValidityLine} from './ValidityLine';
import {GenericSectionItem, Section} from '@atb/components/sections';

export function UnknownFareContract({fc}: {fc: FareContract}) {
  const {t} = useTranslation();

  return (
    <Section withBottomPadding>
      <GenericSectionItem>
        <ValidityLine status="unknown" />
        <ThemeText>
          {t(FareContractTexts.unknownFareContract.message)}
        </ThemeText>
      </GenericSectionItem>
      <GenericSectionItem>
        <ThemeText>
          {t(FareContractTexts.unknownFareContract.orderId(fc.orderId))}
        </ThemeText>
      </GenericSectionItem>
    </Section>
  );
}
