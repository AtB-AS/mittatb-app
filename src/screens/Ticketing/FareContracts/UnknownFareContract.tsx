import * as Sections from '@atb/components/sections';
import {ThemeText} from '@atb/components/text';
import {FareContract} from '@atb/ticketing';
import {FareContractTexts, useTranslation} from '@atb/translations';
import React from 'react';
import ValidityLine from './ValidityLine';

export default function UnknownFareContract({fc}: {fc: FareContract}) {
  const {t} = useTranslation();

  return (
    <Sections.Section withBottomPadding>
      <Sections.GenericSectionItem>
        <ValidityLine status="unknown" />
        <ThemeText>
          {t(FareContractTexts.unknownFareContract.message)}
        </ThemeText>
      </Sections.GenericSectionItem>
      <Sections.GenericSectionItem>
        <ThemeText>
          {t(FareContractTexts.unknownFareContract.orderId(fc.orderId))}
        </ThemeText>
      </Sections.GenericSectionItem>
    </Sections.Section>
  );
}
