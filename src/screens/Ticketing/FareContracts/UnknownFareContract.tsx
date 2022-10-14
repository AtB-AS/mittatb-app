import * as Sections from '@atb/components/sections';
import ThemeText from '@atb/components/text';
import {FareContract} from '@atb/ticketing';
import {FareContractTexts, useTranslation} from '@atb/translations';
import React from 'react';
import ValidityLine from './ValidityLine';

export default function UnknownFareContract({fc}: {fc: FareContract}) {
  const {t} = useTranslation();

  return (
    <Sections.Section withBottomPadding>
      <Sections.GenericItem>
        <ValidityLine status="unknown" />
        <ThemeText>
          {t(FareContractTexts.unknownFareContract.message)}
        </ThemeText>
      </Sections.GenericItem>
      <Sections.GenericItem>
        <ThemeText>
          {t(FareContractTexts.unknownFareContract.orderId(fc.orderId))}
        </ThemeText>
      </Sections.GenericItem>
    </Sections.Section>
  );
}
