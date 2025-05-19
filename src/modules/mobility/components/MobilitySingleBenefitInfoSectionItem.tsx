import {View} from 'react-native';
import {ThemeText} from '@atb/components/text';
import {OperatorBenefitType} from '@atb-as/config-specs/lib/mobility';
import {getTextForLanguage, useTranslation} from '@atb/translations';
import {BenefitImageAsset} from './BenefitImage';
import React from 'react';
import {SectionItemProps, useSectionItem} from '@atb/components/sections';
import {toFormFactorEnum} from '../utils';
import {StyleSheet} from '@atb/theme';

type Props = SectionItemProps<{
  benefit: OperatorBenefitType;
}>;

export const MobilitySingleBenefitInfoSectionItem = ({
  benefit,
  ...props
}: Props) => {
  const styles = useStyles();
  const {topContainer} = useSectionItem(props);
  const {language} = useTranslation();
  return (
    <View style={topContainer}>
      <View style={styles.mobilityBenefit}>
        {benefit.formFactors.map((ff) => (
          <BenefitImageAsset formFactor={toFormFactorEnum(ff)} key={ff} />
        ))}
        <ThemeText
          typography="body__secondary"
          style={styles.mobilityBenefitText}
        >
          {getTextForLanguage(benefit.ticketDescription, language)}
        </ThemeText>
      </View>
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  mobilityBenefit: {
    flexDirection: 'row',
    alignItems: 'center',
    columnGap: theme.spacing.medium,
  },
  mobilityBenefitText: {
    flexShrink: 1,
  },
}));
