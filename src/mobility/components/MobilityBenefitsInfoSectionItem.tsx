import {View} from 'react-native';
import {useOperatorBenefitsForFareProduct} from '@atb/mobility/use-operator-benefits-for-fare-product';
import {screenReaderPause, ThemeText} from '@atb/components/text';
import {BorderedInfoBox} from '@atb/components/bordered-info-box';
import {OperatorBenefitType} from '@atb-as/config-specs/lib/mobility-operators';
import {getTextForLanguage, useTranslation} from '@atb/translations';
import {BenefitImageAsset} from '@atb/mobility/components/BenefitImage';
import React from 'react';
import {SectionItemProps, useSectionItem} from '@atb/components/sections';
import {toFormFactorEnum} from '@atb/mobility/utils';
import {StyleSheet} from '@atb/theme';
import {MobilityTexts} from '@atb/translations/screens/subscreens/MobilityTexts';
import {useFontScale} from '@atb/utils/use-font-scale';

type Props = SectionItemProps<{
  fareProductId?: string;
}>;

export const MobilityBenefitsInfoSectionItem = ({
  fareProductId,
  ...props
}: Props) => {
  const {benefits, status} = useOperatorBenefitsForFareProduct(fareProductId);
  const {topContainer} = useSectionItem(props);
  const {t, language} = useTranslation();
  const styles = useStyles();
  if (status !== 'success') return null;
  if (!benefits?.length) return null;

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
      <ThemeText type="body__secondary" color="secondary">
        {t(MobilityTexts.includedWithTheTicket)}
      </ThemeText>
      <BorderedInfoBox
        backgroundColor="background_0"
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
      <ThemeText type="body__tertiary" style={styles.benefitText}>
        {getTextForLanguage(ticketDescription, language)}
      </ThemeText>
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => {
  const fontScale = useFontScale();
  return {
    borderedInfoBox: {marginTop: theme.spacings.small},
    borderedInfoBoxContent: {gap: theme.spacings.small},
    benefitInfo: {flexDirection: 'row', flex: 1, gap: theme.spacings.small},
    formFactorsContainer: {height: 18 * fontScale, aspectRatio: 1},
    benefitText: {flex: 1},
  };
});
