import {ThemeText} from '@atb/components/text';
import {FareContract} from '@atb/ticketing';
import {FareContractTexts, useTranslation} from '@atb/translations';
import React from 'react';
import {ValidityLine} from './ValidityLine';
import {GenericSectionItem, Section} from '@atb/components/sections';
import { StyleSheet } from '@atb/theme';

export function UnknownFareContract({fc}: {fc: FareContract}) {
  const {t} = useTranslation();
  const styles = useStyles();

  return (
    <Section style={styles.section}>
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

const useStyles = StyleSheet.createThemeHook((theme) => ({
  section: {
    marginBottom: theme.spacings.large,
  },
}));