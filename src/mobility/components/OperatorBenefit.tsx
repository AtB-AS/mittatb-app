import {GenericSectionItem, Section} from '@atb/components/sections';
import {View, ViewStyle} from 'react-native';
import {ThemeText} from '@atb/components/text';
import React from 'react';
import {StyleSheet} from '@atb/theme';
import {OperatorBenefitType} from '@atb-as/config-specs/lib/mobility-operators';
import {getTextForLanguage, useTranslation} from '@atb/translations';
import {FormFactor} from '@atb/api/types/generated/mobility-types_v2';
import {Check} from '@atb/assets/svg/color/icons/status';
import {
  BundlingCarSharing,
  BundlingCityBike,
} from '@atb/assets/svg/color/images/mobility';

type Props = {
  benefit: OperatorBenefitType;
  isUserEligible: boolean;
  formFactor: FormFactor;
  style?: ViewStyle;
};

export const OperatorBenefit = ({
  benefit,
  isUserEligible,
  formFactor,
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
            <BenefitImage eligible={isUserEligible} formFactor={formFactor} />
            <View style={style.benefitContent}>
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
  switch (formFactor) {
    case FormFactor.Car:
      return <BundlingCarSharing />;
    case FormFactor.Bicycle:
      return <BundlingCityBike />;
    default:
      return <View />;
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
    marginStart: theme.spacings.medium,
  },
  benefitImage: {
    flex: 1,
    resizeMode: 'contain',
    marginRight: theme.spacings.medium,
  },
  indicator: {
    position: 'absolute',
    right: 0,
    top: 0,
    borderRadius: theme.border.radius.circle,
    zIndex: 10,
    overflow: 'hidden',
  },
}));
