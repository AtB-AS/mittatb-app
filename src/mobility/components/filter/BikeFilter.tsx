import {MapFilterProps} from '@atb/mobility/components/filter/types';
import {useTranslation} from '@atb/translations';
import {useOperatorToggle} from '@atb/mobility/components/filter/use-operator-toggle';
import {Section, ToggleSectionItem} from '@atb/components/sections';
import {MobilityTexts} from '@atb/translations/screens/subscreens/MobilityTexts';
import {Bicycle} from '@atb/assets/svg/mono-icons/vehicles';
import React from 'react';
import {useOperators} from '@atb/mobility/use-operators';
import {FormFactor} from '@atb/api/types/generated/mobility-types_v2';

export const BikeFilter = ({
  initialFilter,
  onFilterChange,
  style,
}: MapFilterProps) => {
  const {t} = useTranslation();
  const operators = useOperators();
  const bikeOperators = operators(FormFactor.Bicycle);
  const {showAll, isChecked, onAllToggle, onOperatorToggle} = useOperatorToggle(
    bikeOperators,
    initialFilter,
    onFilterChange,
  );

  return (
    <Section style={style}>
      <ToggleSectionItem
        text={t(MobilityTexts.bicycle)}
        textType={'body__primary--bold'}
        leftIcon={Bicycle}
        value={showAll()}
        onValueChange={onAllToggle}
      />
      {bikeOperators.length > 1 &&
        bikeOperators.map((operator) => (
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
