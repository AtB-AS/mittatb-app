import {View} from 'react-native';
import {screenReaderPause, ThemeText} from '@atb/components/text';
import {BorderedInfoBox} from '@atb/components/bordered-info-box';
import {getTextForLanguage, useTranslation} from '@atb/translations';
import {BenefitIllustration} from './BenefitIllustration';
import React from 'react';
import {SectionItemProps, useSectionItem} from '@atb/components/sections';
import {StyleSheet, useThemeContext} from '@atb/theme';
import {MobilityTexts} from '@atb/translations/screens/subscreens/MobilityTexts';
import type {FareProductBenefitType} from '../use-operator-benefits-for-fare-product';

type Props = SectionItemProps<{
  benefits: FareProductBenefitType[];
}>;

export const MobilityBenefitsInfoSectionItem = ({
  benefits,
  ...props
}: Props) => {
  const {topContainer} = useSectionItem(props);
  const {t, language} = useTranslation();
  const styles = useStyles();
  const {theme} = useThemeContext();

  const accessibilityLabel =
    t(MobilityTexts.includedWithTheTicket) +
    screenReaderPause +
    benefits
      .map((b) =>
        [
          getTextForLanguage(b.title, language),
          getTextForLanguage(b.description, language),
        ]
          .filter(Boolean)
          .join(screenReaderPause),
      )
      .join(screenReaderPause);

  return (
    <View
      style={topContainer}
      accessible={true}
      accessibilityLabel={accessibilityLabel}
    >
      <ThemeText typography="body__s" type="secondary">
        {t(MobilityTexts.includedWithTheTicket)}
      </ThemeText>
      <BorderedInfoBox
        backgroundColor={theme.color.background.neutral[0]}
        type="large"
        style={styles.borderedInfoBox}
      >
        <View style={styles.borderedInfoBoxContent}>
          {benefits.map((b) => (
            <BenefitInfo benefit={b} key={b.operatorId} />
          ))}
        </View>
      </BorderedInfoBox>
    </View>
  );
};

const BenefitInfo = ({
  benefit: {illustrationName, title, description},
}: {
  benefit: FareProductBenefitType;
}) => {
  const {language} = useTranslation();
  const styles = useStyles();
  const titleText = getTextForLanguage(title, language);
  const descriptionText = getTextForLanguage(description, language);
  return (
    <View style={styles.benefitInfo}>
      <BenefitIllustration illustrationName={illustrationName} />
      <View style={styles.benefitText}>
        {!!titleText && (
          <ThemeText typography="body__s__strong">{titleText}</ThemeText>
        )}
        {!!descriptionText && (
          <ThemeText typography="body__xs">{descriptionText}</ThemeText>
        )}
      </View>
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => {
  return {
    borderedInfoBox: {marginTop: theme.spacing.small},
    borderedInfoBoxContent: {gap: theme.spacing.small},
    benefitInfo: {
      flexDirection: 'row',
      flex: 1,
      gap: theme.spacing.small,
      alignItems: 'center',
    },
    benefitText: {flex: 1, gap: theme.spacing.xSmall},
  };
});
