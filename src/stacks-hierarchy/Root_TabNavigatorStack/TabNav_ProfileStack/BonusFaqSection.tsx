import {BonusProgramTexts, useTranslation} from '@atb/translations';
import {ThemeText} from '@atb/components/text';
import React from 'react';
import {ExpandableSectionItem, Section} from '@atb/components/sections';

export const BonusFaqSection = () => {
  const {t} = useTranslation();

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
                <ThemeText isMarkdown={false} type="secondary">
                  {t(answer())}
                </ThemeText>
              }
            />
          ),
        )
      }
    </Section>
  );
};
