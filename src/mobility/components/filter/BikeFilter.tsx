import {MapFilterProps} from '@atb/mobility/components/filter/types';
import {useTranslation} from '@atb/translations';
import {useOperatorToggle} from '@atb/mobility/components/filter/use-operator-toggle';
import {Section, ToggleSectionItem} from '@atb/components/sections';
import {MobilityTexts} from '@atb/translations/screens/subscreens/MobilityTexts';
import {Bicycle} from '@atb/assets/svg/mono-icons/vehicles';
import React from 'react';
import {useOperators} from '@atb/mobility/use-operators';
import {FormFactor} from '@atb/api/types/generated/mobility-types_v2';
import {ThemeText} from '@atb/components/text';
import {View} from 'react-native';
import {useFilterStyle} from '@atb/mobility/components/filter/use-filter-style';

export const BikeFilter = ({
  initialFilter,
  onFilterChange,
  style,
}: MapFilterProps) => {
  const {t} = useTranslation();
  const filterStyle = useFilterStyle();
  const operators = useOperators();
  const bikeOperators = operators(FormFactor.Bicycle);
  const {showAll, isChecked, onAllToggle, onOperatorToggle} = useOperatorToggle(
    bikeOperators,
    initialFilter,
    onFilterChange,
  );

  return (
    <View style={style}>
      <ThemeText style={filterStyle.sectionHeader} type={'body__secondary'}>
        {t(MobilityTexts.bicycle)}
      </ThemeText>
      <Section>
        {bikeOperators.length > 1 && (
          <ToggleSectionItem
            text={t(MobilityTexts.filter.selectAll)}
            value={showAll()}
            onValueChange={onAllToggle}
          />
        )}
        {bikeOperators.map((operator) => (
          <ToggleSectionItem
            key={operator.id}
            text={operator.name}
            leftIcon={Bicycle}
            value={isChecked(operator.id)}
            onValueChange={onOperatorToggle(operator.id)}
          />
        ))}
      </Section>
    </View>
  );
};
