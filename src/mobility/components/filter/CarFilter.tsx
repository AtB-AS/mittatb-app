import {MapFilterProps} from '@atb/mobility/components/filter/types';
import {useTranslation} from '@atb/translations';
import {useOperatorToggle} from '@atb/mobility/components/filter/use-operator-toggle';
import {Section, ToggleSectionItem} from '@atb/components/sections';
import {MobilityTexts} from '@atb/translations/screens/subscreens/MobilityTexts';
import {Car} from '@atb/assets/svg/mono-icons/transportation';
import React from 'react';
import {FormFactor} from '@atb/api/types/generated/mobility-types_v2';
import {useOperators} from '@atb/mobility/use-operators';

export const CarFilter = ({
  initialFilter,
  onFilterChange,
  style,
}: MapFilterProps) => {
  const {t} = useTranslation();
  const operators = useOperators();
  const {showAll, isChecked, onAllToggle, onOperatorToggle} = useOperatorToggle(
    initialFilter,
    onFilterChange,
  );

  return (
    <Section style={style}>
      <ToggleSectionItem
        text={t(MobilityTexts.car)}
        textType={'body__primary--bold'}
        leftIcon={Car}
        value={showAll()}
        onValueChange={onAllToggle}
      />
      {operators(FormFactor.Car).map((operator) => (
        <ToggleSectionItem
          key={operator.id}
          text={operator.name}
          value={isChecked(operator.id)}
          onValueChange={onOperatorToggle(operator.id)}
        />
      ))}
    </Section>
  );
};
