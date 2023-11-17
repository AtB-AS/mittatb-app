import {GenericSectionItem, Section} from '@atb/components/sections';
import {Image, ImageStyle, View, ViewStyle} from 'react-native';
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
              {isUserEligible && benefit.imageWhenActive && (
                <Image
                  style={style.benefitImage as ImageStyle}
                  source={{uri: benefit.imageWhenActive}}
                />
              )}
              {!isUserEligible && benefit.imageWhenNotActive && (
                <Image
                  style={style.benefitImage as ImageStyle}
                  source={{uri: benefit.imageWhenNotActive}}
                />
              )}
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
  benefitContent: {
    flex: 4,
  },
  benefitImage: {
    flex: 1,
    resizeMode: 'contain',
    marginRight: theme.spacings.medium,
  },
}));
