import React from 'react';
import {View} from 'react-native';
import {getTextForLanguage, useTranslation} from '@atb/translations';
import {StyleSheet} from '@atb/theme';
import {GenericSectionItem, Section} from '@atb/components/sections';
import {screenReaderPause, ThemeText} from '@atb/components/text';
import {BenefitIllustration} from './BenefitIllustration';
import type {NotEligibleBenefitType} from '@atb/api/types/benefit';

type Props = {
  notEligibleBenefit: NotEligibleBenefitType;
};

export const NotEligibleBenefitCard = ({notEligibleBenefit}: Props) => {
  const {language} = useTranslation();
  const styles = useStyles();

  const title = getTextForLanguage(notEligibleBenefit.title, language);
  const description = getTextForLanguage(
    notEligibleBenefit.description,
    language,
  );
  if (!title && !description) return null;

  return (
    <Section>
      <GenericSectionItem style={styles.sectionWrapper}>
        <View
          style={styles.container}
          accessible={true}
          accessibilityLabel={[title, description]
            .filter(Boolean)
            .join(screenReaderPause)}
        >
          <BenefitIllustration
            illustrationName={notEligibleBenefit.illustrationName}
            style={styles.illustration}
          />
          <View style={styles.content}>
            {!!title && (
              <ThemeText typography="body__m__strong">{title}</ThemeText>
            )}
            {!!description && (
              <ThemeText typography="body__s" type="secondary">
                {description}
              </ThemeText>
            )}
          </View>
        </View>
      </GenericSectionItem>
    </Section>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => {
  return {
    sectionWrapper: {
      padding: theme.spacing.small,
    },
    container: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
    },
    illustration: {
      marginEnd: theme.spacing.medium,
    },
    content: {
      flex: 1,
      gap: theme.spacing.xSmall,
    },
  };
});
