import {Section, ToggleSectionItem} from '@atb/components/sections';
import {MobilityTexts} from '@atb/translations/screens/subscreens/MobilityTexts';
import {Scooter} from '@atb/assets/svg/mono-icons/transportation-entur';
import React from 'react';
import {useTranslation} from '@atb/translations';
import {useOperatorToggle} from './use-operator-toggle';
import {MapFilterProps} from './types';
import {useOperators} from '../../use-operators';
import {FormFactor} from '@atb/api/types/generated/mobility-types_v2';
import {ThemeText} from '@atb/components/text';
import {useFilterStyle} from '@atb/mobility/components/filter/use-filter-style';
import {View} from 'react-native';

export const ScooterFilter = ({
  initialFilter,
  onFilterChange,
  style,
}: MapFilterProps) => {
  const {t} = useTranslation();
  const filterStyle = useFilterStyle();
  const operators = useOperators();
  const scooterOperators = operators.byFormFactor(FormFactor.Scooter);
  const {showAll, isChecked, onAllToggle, onOperatorToggle} = useOperatorToggle(
    scooterOperators,
    initialFilter,
    onFilterChange,
  );

  return (
    <View style={style}>
      <ThemeText style={filterStyle.sectionHeader} type={'body__secondary'}>
        {t(MobilityTexts.scooter)}
      </ThemeText>
      <Section style={style}>
        {scooterOperators.length !== 1 && (
          <ToggleSectionItem
            text={t(MobilityTexts.filter.selectAll)}
            value={showAll()}
            onValueChange={onAllToggle}
          />
        )}
        {scooterOperators.map((operator) => (
          <ToggleSectionItem
            key={operator.id}
            text={operator.name}
            leftIcon={Scooter}
            value={isChecked(operator.id)}
            onValueChange={onOperatorToggle(operator.id)}
          />
        ))}
      </Section>
    </View>
  );
};
