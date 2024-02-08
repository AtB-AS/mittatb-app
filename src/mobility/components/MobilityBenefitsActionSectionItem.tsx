import {MapFilterType} from '@atb/components/map';
import {SectionItemProps, useSectionItem} from '@atb/components/sections';
import {ThemeText} from '@atb/components/text';
import {StyleSheet} from '@atb/theme';
import {FareContractTexts, useTranslation} from '@atb/translations';
import React from 'react';
import {View} from 'react-native';
import {FareProductBenefitType} from '../use-operator-benefits-for-fare-product';
import {BenefitTiles} from './BenefitTiles';

type Props = SectionItemProps<{
  benefits: FareProductBenefitType[];
  onNavigateToMap: (initialFilters: MapFilterType) => void;
}>;

export const MobilityBenefitsActionSectionItem = ({
  onNavigateToMap,
  benefits,
  ...props
}: Props) => {
  const styles = useStyles();
  const {topContainer} = useSectionItem(props);
  const {t} = useTranslation();
  return (
    <View style={[topContainer, styles.benefitSection]}>
      <ThemeText type="body__secondary" color="secondary">
        {t(FareContractTexts.label.includedBenefits)}
      </ThemeText>
      <BenefitTiles
        benefits={benefits}
        onNavigateToMap={onNavigateToMap}
        interactiveColor="interactive_2"
      />
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => ({
  benefitSection: {
    rowGap: theme.spacings.small,
  },
}));
