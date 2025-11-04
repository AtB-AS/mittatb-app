import {GenericSectionItem, Section} from '@atb/components/sections';
import {View, ViewStyle} from 'react-native';
import {ThemeText} from '@atb/components/text';
import React from 'react';
import {OperatorBenefitType} from '@atb-as/config-specs/lib/mobility';
import {getTextForLanguage, useTranslation} from '@atb/translations';
import {useIsEligibleForBenefit} from '../use-is-eligible-for-benefit';
import {FormFactor} from '@atb/api/types/generated/mobility-types_v2';
import {BenefitImage} from './BenefitImage';
import {StyleSheet} from '@atb/theme';

type Props = {
  benefit: OperatorBenefitType;
  formFactor: FormFactor;
  style?: ViewStyle;
};

export const OperatorBenefit = ({benefit, formFactor, style}: Props) => {
  const styles = useStyles();
  const {language} = useTranslation();
  const {isUserEligibleForBenefit, isLoading, isError} =
    useIsEligibleForBenefit(benefit);

  if (isLoading || isError) return null;

  const heading = getTextForLanguage(
    isUserEligibleForBenefit
      ? benefit.headingWhenActive
      : benefit.headingWhenNotActive,
    language,
  );
  const text =
    getTextForLanguage(
      isUserEligibleForBenefit
        ? benefit.descriptionWhenActive
        : benefit.descriptionWhenNotActive,
      language,
    ) ?? '';

  return (
    <View style={style}>
      <Section>
        <GenericSectionItem>
          <View style={styles.benefitContainer}>
            <BenefitImage
              eligible={isUserEligibleForBenefit}
              formFactor={formFactor}
              style={styles.benefitImage}
            />
            <View style={styles.benefitContent}>
              {heading && (
                <ThemeText typography="body__m__strong">{heading}</ThemeText>
              )}
              <ThemeText typography="body__s" color="secondary">
                {text}
              </ThemeText>
            </View>
          </View>
        </GenericSectionItem>
      </Section>
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  benefitContainer: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  benefitContent: {
    flex: 4,
  },
  benefitImage: {
    marginEnd: theme.spacing.medium,
  },
}));
