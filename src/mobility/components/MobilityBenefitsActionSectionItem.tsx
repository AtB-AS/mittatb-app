import {MapFilterType} from '@atb/components/map';
import {SectionItemProps, useSectionItem} from '@atb/components/sections';
import {ThemeText} from '@atb/components/text';
import {StyleSheet} from '@atb/theme';
import {FareContractTexts, useTranslation} from '@atb/translations';
import React from 'react';
import {View} from 'react-native';
import {useOperatorBenefitsForFareProduct} from '../use-operator-benefits-for-fare-product';
import {BenefitTiles} from './BenefitTile';

type Props = SectionItemProps<{
  preassignedFareProductId: string;
  onNavigateToMap: (initialFilters: MapFilterType) => void;
}>;

export const MobilityBenefitsActionSectionItem = ({
  preassignedFareProductId,
  onNavigateToMap,
  ...props
}: Props) => {
  const styles = useStyles();
  const {topContainer} = useSectionItem(props);
  const {t} = useTranslation();
  const {benefits} = useOperatorBenefitsForFareProduct(
    preassignedFareProductId,
  );
  if (!benefits || benefits.length < 1) return null;
  return (
    <View style={[topContainer, styles.benefitSection]}>
      <ThemeText type="body__secondary" color="secondary">
        {t(FareContractTexts.label.indludedBenefits)}
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
