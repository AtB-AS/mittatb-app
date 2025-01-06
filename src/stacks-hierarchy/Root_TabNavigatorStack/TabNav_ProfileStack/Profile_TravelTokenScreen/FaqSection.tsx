import {TravelTokenTexts, useTranslation} from '@atb/translations';
import {ThemeText} from '@atb/components/text';
import React from 'react';
import {StyleSheet, Theme} from '@atb/theme';
import {
  ExpandableSectionItem,
  HeaderSectionItem,
  Section,
} from '@atb/components/sections';
import {useRemoteConfigContext} from '@atb/RemoteConfigContext';

const FaqSection = ({toggleMaxLimit}: {toggleMaxLimit?: number}) => {
  const {t} = useTranslation();
  const styles = useStyles();
  const {disable_travelcard} = useRemoteConfigContext();

  return (
    <Section style={styles.faqSection}>
      <HeaderSectionItem text={t(TravelTokenTexts.travelToken.faq.title)} />
      {toggleMaxLimit ? (
        <ExpandableSectionItem
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
      {(disable_travelcard
        ? // eslint-disable-next-line rulesdir/translations-warning
          TravelTokenTexts.travelToken.faqsWithoutTravelcard
        : // eslint-disable-next-line rulesdir/translations-warning
          TravelTokenTexts.travelToken.faqs
      ).map(({question, answer}, index) => (
        <ExpandableSectionItem
          key={index}
          text={t(question)}
          showIconText={false}
          expandContent={<ThemeText isMarkdown={true}>{t(answer)}</ThemeText>}
        />
      ))}
    </Section>
  );
};

const useStyles = StyleSheet.createThemeHook((theme: Theme) => ({
  faqSection: {
    marginBottom: theme.spacing.xLarge,
  },
}));

export {FaqSection};
