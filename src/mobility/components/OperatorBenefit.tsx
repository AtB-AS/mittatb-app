import {GenericSectionItem, Section} from '@atb/components/sections';
import {View, ViewStyle} from 'react-native';
import {SvgXml} from 'react-native-svg';
import {ThemeText} from '@atb/components/text';
import React from 'react';
import {StyleSheet} from '@atb/theme';
import {OperatorBenefitType} from '@atb-as/config-specs/lib/mobility-operators';
import {getTextForLanguage, useTranslation} from '@atb/translations';
import {useIsEligibleForBenefit} from '@atb/mobility/use-is-eligible-for-benefit';

type Props = {
  benefit: OperatorBenefitType;
  style?: ViewStyle;
};
export const OperatorBenefit = ({benefit, style: containerStyle}: Props) => {
  const style = useStyles();
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
    <View style={containerStyle}>
      <Section>
        <GenericSectionItem>
          <View style={style.benefitContainer}>
            <View style={style.benefitImage}>
              {isUserEligibleForBenefit && benefit.imageWhenActive && (
                <SvgXml xml={benefit.imageWhenActive} />
              )}
              {!isUserEligibleForBenefit && benefit.imageWhenNotActive && (
                <SvgXml xml={benefit.imageWhenNotActive} />
              )}
            </View>
            <View style={style.benefitContent}>
              <ThemeText type="body__primary--bold">{heading}</ThemeText>
              <ThemeText>{text}</ThemeText>
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
  },
  benefitImage: {
    marginRight: theme.spacings.medium,
    justifyContent: 'center',
  },
  benefitContent: {
    flex: 1,
  },
}));
