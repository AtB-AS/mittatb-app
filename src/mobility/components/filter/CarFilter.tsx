import {MapFilterProps} from '@atb/mobility/components/filter/types';
import {useTranslation} from '@atb/translations';
import {useOperatorToggle} from '@atb/mobility/components/filter/use-operator-toggle';
import {Section, ToggleSectionItem} from '@atb/components/sections';
import {MobilityTexts} from '@atb/translations/screens/subscreens/MobilityTexts';
import {Car} from '@atb/assets/svg/mono-icons/transportation';
import React from 'react';
import {FormFactor} from '@atb/api/types/generated/mobility-types_v2';
import {useOperators} from '@atb/mobility/use-operators';
import {ThemeText} from '@atb/components/text';
import {useFilterStyle} from '@atb/mobility/components/filter/use-filter-style';
import {View} from 'react-native';

export const CarFilter = ({
  initialFilter,
  onFilterChange,
  style,
}: MapFilterProps) => {
  const {t} = useTranslation();
  const filterStyle = useFilterStyle();
  const operators = useOperators();
  const carOperators = operators.byFormFactor(FormFactor.Car);
  const {showAll, isChecked, onAllToggle, onOperatorToggle} = useOperatorToggle(
    carOperators,
    initialFilter,
    onFilterChange,
  );

  return (
    <View style={style}>
      <ThemeText style={filterStyle.sectionHeader} type={'body__secondary'}>
        {t(MobilityTexts.car)}
      </ThemeText>
      <Section>
        {carOperators.length !== 1 && (
          <ToggleSectionItem
            text={t(MobilityTexts.filter.selectAll)}
            value={showAll()}
            onValueChange={onAllToggle}
          />
        )}
        {carOperators.map((operator) => (
          <ToggleSectionItem
            key={operator.id}
            text={operator.name}
            leftIcon={Car}
            value={isChecked(operator.id)}
            onValueChange={onOperatorToggle(operator.id)}
          />
        ))}
      </Section>
    </View>
  );
};
