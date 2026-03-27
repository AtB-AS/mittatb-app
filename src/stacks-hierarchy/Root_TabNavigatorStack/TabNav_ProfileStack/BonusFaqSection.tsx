import {BonusProgramTexts, useTranslation} from '@atb/translations';
import {ThemeText} from '@atb/components/text';
import React from 'react';
import {ExpandableSectionItem, Section} from '@atb/components/sections';
import {useProgram, KnownProgramId} from '@atb/modules/enrollment';
import {useProductPointsQuery} from '@atb/modules/bonus';
import {formatToDate} from '@atb/utils/date';

export const BonusFaqSection = () => {
  const {t, language} = useTranslation();
  const bonusProgram = useProgram(KnownProgramId.BONUS);
  const endDateString = bonusProgram?.endAt
    ? formatToDate(bonusProgram.endAt, language)
    : '';
  const {data: productPoints} = useProductPointsQuery();
  const pointsPerTicket =
    productPoints?.find(
      (p) => p.fareProduct === 'ATB:PreassignedFareProduct:8808c360', //TODO: get this value from _somewhere_ else.
    )?.value ?? 0;

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
