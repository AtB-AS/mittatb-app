import {GenericSectionItem, Section} from '@atb/components/sections';
import {View, ViewStyle} from 'react-native';
import {ThemeText} from '@atb/components/text';
import React from 'react';
import {StyleSheet} from '@atb/theme';
import {OperatorBenefitType} from '@atb-as/config-specs/lib/mobility-operators';
import {getTextForLanguage, useTranslation} from '@atb/translations';
import {useIsEligibleForBenefit} from '@atb/mobility/use-is-eligible-for-benefit';
import {FormFactor} from '@atb/api/types/generated/mobility-types_v2';
import {Check} from '@atb/assets/svg/color/icons/status';
import {
  BundlingCarSharing,
  BundlingCityBike,
} from '@atb/assets/svg/color/images/mobility';

type Props = {
  benefit: OperatorBenefitType;
  formFactor: FormFactor;
  style?: ViewStyle;
};

export const OperatorBenefit = ({
  benefit,
  formFactor,
  style,
}: Props) => {
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
            <BenefitImage eligible={isUserEligibleForBenefit} formFactor={formFactor}/>
            <View style={styles.benefitContent}>
              {heading && (
                <ThemeText type="body__primary--bold">{heading}</ThemeText>
              )}
              <ThemeText>{text}</ThemeText>
            </View>
          </View>
        </GenericSectionItem>
      </Section>
    </View>
  );
};

const BenefitImageAsset = ({formFactor} : {formFactor: FormFactor}) => {
  const styles = useStyles();
  switch (formFactor) {
    case FormFactor.Car:
      return <BundlingCarSharing style={styles.benefitImage}/>;
    case FormFactor.Bicycle:
      return <BundlingCityBike style={styles.benefitImage}/>;
    default:
      return null;
  }
}

type BenefitImageProps = {
  formFactor: FormFactor;
  eligible: boolean;
  style?: ViewStyle;
};

const BenefitImage = ({
  formFactor,
  eligible,
  style,
}: BenefitImageProps): JSX.Element => {

  return (
    <View style={style}>
      <>
        <BenefitImageAsset formFactor={formFactor} />
        {eligible && (<BenfitEligibilityIndicator />)}
      </>
    </View>
  );
};

const BenfitEligibilityIndicator = () => {
  const styles = useStyles();

  return (
    <View style={styles.indicator}>
      <Check width={24} height={24} />
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
    marginEnd: theme.spacings.medium,
    marginStart: theme.spacings.small,
  },
  indicator: {
    position: 'absolute',
    right: theme.spacings.medium,
  },
}));
