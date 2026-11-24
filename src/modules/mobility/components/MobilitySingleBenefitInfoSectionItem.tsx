import {View} from 'react-native';
import React from 'react';
import {SectionItemProps, useSectionItem} from '@atb/components/sections';
import type {FareProductBenefitType} from '../use-operator-benefits-for-fare-product';
import {BenefitInfo} from './MobilityBenefitsInfoSectionItem';

type Props = SectionItemProps<{
  benefit: FareProductBenefitType;
}>;

export const MobilitySingleBenefitInfoSectionItem = ({
  benefit,
  ...props
}: Props) => {
  const {topContainer} = useSectionItem(props);
  return (
    <View style={topContainer} accessible={true}>
      <BenefitInfo benefit={benefit} />
    </View>
  );
};
