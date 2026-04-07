import {BonusProgramTexts, useTranslation} from '@atb/translations';
import {ThemeText} from '@atb/components/text';
import React from 'react';
import {ExpandableSectionItem, Section} from '@atb/components/sections';
import {useProgram, KnownProgramId} from '@atb/modules/enrollment';
import {useProductPointsQuery} from '@atb/modules/bonus';
import {useFirestoreConfigurationContext} from '@atb/modules/configuration';
import {formatToDate} from '@atb/utils/date';

export const BonusFaqSection = () => {
  const {t, language} = useTranslation();
  const bonusProgram = useProgram(KnownProgramId.BONUS);
  const endDateString = bonusProgram?.endAt
    ? formatToDate(bonusProgram.endAt, language)
    : '';
  const {bonusSources} = useFirestoreConfigurationContext();
  const {data: productPoints} = useProductPointsQuery();
  const fareProductId = bonusSources?.find(
    (s) => s.id === 'single-ticket',
  )?.preassignedFareProductId;

  const pointsPerTicket =
    productPoints?.find((p) => p.fareProduct === fareProductId)?.value ?? 0;

  const faqContext = {
    endDate: endDateString,
    pointsPerTicket,
  };

  return (
    <Section>
      {
        // eslint-disable-next-line rulesdir/translations-warning
        BonusProgramTexts.bonusProfile.faq.faqs.map(
          ({question, answer}, index) => (
            <ExpandableSectionItem
              key={index}
              text={t(question)}
              showIconText={false}
              expandContent={
                <ThemeText isMarkdown={false} color="secondary">
                  {t(answer(faqContext))}
                </ThemeText>
              }
            />
          ),
        )
      }
    </Section>
  );
};
