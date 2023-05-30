import {Section, ToggleSectionItem} from '@atb/components/sections';
import {MobilityTexts} from '@atb/translations/screens/subscreens/MobilityTexts';
import {Scooter} from '@atb/assets/svg/mono-icons/transportation-entur';
import React from 'react';
import {useTranslation} from '@atb/translations';
import {useOperatorToggle} from './use-operator-toggle';
import {MapFilterProps} from './types';
import {useOperators} from '../../use-operators';
import {FormFactor} from '@atb/api/types/generated/mobility-types_v2';

export const ScooterFilter = ({
  initialFilter,
  onFilterChange,
  style,
}: MapFilterProps) => {
  const {t} = useTranslation();
  const operators = useOperators();
  const scooterOperators = operators(FormFactor.Scooter);
  const {showAll, isChecked, onAllToggle, onOperatorToggle} = useOperatorToggle(
    scooterOperators,
    initialFilter,
    onFilterChange,
  );

  return (
    <Section style={style}>
      <ToggleSectionItem
        text={t(MobilityTexts.scooter)}
        textType={'body__primary--bold'}
        leftIcon={Scooter}
        value={showAll()}
        onValueChange={onAllToggle}
      />
      {scooterOperators.map((operator) => (
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
