import {BonusProgramTexts, useTranslation} from '@atb/translations';
import {ThemeText} from '@atb/components/text';
import React from 'react';
import {ExpandableSectionItem, Section} from '@atb/components/sections';
import {useProgramQuery, KnownProgramId} from '@atb/modules/enrollment';
import {formatToVerboseFullDate} from '@atb/utils/date';

export const BonusFaqSection = () => {
  const {t, language} = useTranslation();
  const bonusProgram = useProgramQuery(KnownProgramId.BONUS);
  const endDateString = bonusProgram?.endAt
    ? formatToVerboseFullDate(bonusProgram.endAt, language)
    : '';
  const faqContext = {
    endDate: endDateString,
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
