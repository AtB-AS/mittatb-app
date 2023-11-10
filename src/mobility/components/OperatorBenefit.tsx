import {GenericSectionItem, Section} from '@atb/components/sections';
import {View, ViewStyle} from 'react-native';
import {SvgXml} from 'react-native-svg';
import {ThemeText} from '@atb/components/text';
import React from 'react';
import {StyleSheet} from '@atb/theme';
import {OperatorBenefitType} from '@atb-as/config-specs/lib/mobility-operators';
import {getTextForLanguage, useTranslation} from '@atb/translations';

type Props = {
  benefit: OperatorBenefitType;
  isUserEligible: boolean;
  style?: ViewStyle;
};
export const OperatorBenefit = ({
  benefit,
  isUserEligible,
  style: containerStyle,
}: Props) => {
  const style = useStyles();
  const {language} = useTranslation();

  const heading = getTextForLanguage(
    isUserEligible ? benefit.headingWhenActive : benefit.headingWhenNotActive,
    language,
  );
  const text =
    getTextForLanguage(
      isUserEligible
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
              {isUserEligible && benefit.imageWhenActive && (
                <SvgXml xml={benefit.imageWhenActive} />
              )}
              {!isUserEligible && benefit.imageWhenNotActive && (
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
