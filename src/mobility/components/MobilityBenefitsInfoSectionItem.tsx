import {View} from 'react-native';
import {screenReaderPause, ThemeText} from '@atb/components/text';
import {BorderedInfoBox} from '@atb/components/bordered-info-box';
import {OperatorBenefitType} from '@atb-as/config-specs/lib/mobility-operators';
import {getTextForLanguage, useTranslation} from '@atb/translations';
import {BenefitImageAsset} from '@atb/mobility/components/BenefitImage';
import React from 'react';
import {SectionItemProps, useSectionItem} from '@atb/components/sections';
import {toFormFactorEnum} from '@atb/mobility/utils';
import {StyleSheet, useTheme} from '@atb/theme';
import {MobilityTexts} from '@atb/translations/screens/subscreens/MobilityTexts';
import {useFontScale} from '@atb/utils/use-font-scale';

type Props = SectionItemProps<{
  benefits: OperatorBenefitType[];
}>;

export const MobilityBenefitsInfoSectionItem = ({
  benefits,
  ...props
}: Props) => {
  const {topContainer} = useSectionItem(props);
  const {t, language} = useTranslation();
  const styles = useStyles();
  const {theme} = useTheme();

  const accessibilityLabel =
    t(MobilityTexts.includedWithTheTicket) +
    screenReaderPause +
    benefits
      .map(
        (b) =>
          b.formFactors.map((ff) =>
            t(MobilityTexts.formFactor(toFormFactorEnum(ff))),
          ) +
          screenReaderPause +
          getTextForLanguage(b.ticketDescription, language),
      )
      .join(screenReaderPause);

  return (
    <View
      style={topContainer}
      accessible={true}
      accessibilityLabel={accessibilityLabel}
    >
      <ThemeText typography="body__secondary" color="secondary">
        {t(MobilityTexts.includedWithTheTicket)}
      </ThemeText>
      <BorderedInfoBox
        backgroundColor={theme.color.background.neutral[0]}
        type="large"
        style={styles.borderedInfoBox}
      >
        <View style={styles.borderedInfoBoxContent}>
          {benefits.map((b) => (
            <BenefitInfo benefit={b} key={b.id + b.callToAction.url} />
          ))}
        </View>
      </BorderedInfoBox>
    </View>
  );
};

const BenefitInfo = ({
  benefit: {formFactors, ticketDescription},
}: {
  benefit: OperatorBenefitType;
}) => {
  const {language} = useTranslation();
  const styles = useStyles();
  return (
    <View style={styles.benefitInfo}>
      {formFactors.length && (
        <View style={styles.formFactorsContainer}>
          {formFactors.map((ff) => (
            <BenefitImageAsset
              formFactor={toFormFactorEnum(ff)}
              svgProps={{height: '100%', width: '100%'}}
              key={ff}
            />
          ))}
        </View>
      )}
      <ThemeText typography="body__tertiary" style={styles.benefitText}>
        {getTextForLanguage(ticketDescription, language)}
      </ThemeText>
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => {
  const fontScale = useFontScale();
  return {
    borderedInfoBox: {marginTop: theme.spacing.small},
    borderedInfoBoxContent: {gap: theme.spacing.small},
    benefitInfo: {flexDirection: 'row', flex: 1, gap: theme.spacing.small},
    formFactorsContainer: {height: 18 * fontScale, width: 28 * fontScale},
    benefitText: {flex: 1},
  };
});
