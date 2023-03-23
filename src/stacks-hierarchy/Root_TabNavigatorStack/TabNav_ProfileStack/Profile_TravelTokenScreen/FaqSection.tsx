import {TravelTokenTexts, useTranslation} from '@atb/translations';
import * as Sections from '@atb/components/sections';
import {ThemeText} from '@atb/components/text';
import React from 'react';
import {StyleSheet, Theme} from '@atb/theme';

const FaqSection = ({toggleMaxLimit}: {toggleMaxLimit?: number}) => {
  const {t} = useTranslation();
  const styles = useStyles();

  return (
    <Sections.Section style={styles.faqSection}>
      <Sections.HeaderSectionItem
        text={t(TravelTokenTexts.travelToken.faq.title)}
      />
      {toggleMaxLimit ? (
        <Sections.ExpandableSectionItem
          text={t(TravelTokenTexts.travelToken.tokenToggleFaq.question)}
          showIconText={false}
          expandContent={
            <ThemeText isMarkdown={true}>
              {t(
                TravelTokenTexts.travelToken.tokenToggleFaq.answer(
                  toggleMaxLimit,
                ),
              )}
            </ThemeText>
          }
        />
      ) : null}
      {/*eslint-disable-next-line rulesdir/translations-warning*/}
      {TravelTokenTexts.travelToken.faqs.map(({question, answer}, index) => (
        <Sections.ExpandableSectionItem
          key={index}
          textType={'body__primary--bold'}
          text={t(question)}
          showIconText={false}
          expandContent={
            <ThemeText type={'body__tertiary'} isMarkdown={true}>
              {t(answer)}
            </ThemeText>
          }
        />
      ))}
    </Sections.Section>
  );
};

const useStyles = StyleSheet.createThemeHook((theme: Theme) => ({
  faqSection: {
    marginBottom: theme.spacings.xLarge,
  },
}));

export {FaqSection};
