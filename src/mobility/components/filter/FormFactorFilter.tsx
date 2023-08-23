import {Section, ToggleSectionItem} from '@atb/components/sections';
import {MobilityTexts} from '@atb/translations/screens/subscreens/MobilityTexts';
import React from 'react';
import {useTranslation} from '@atb/translations';
import {useOperatorToggle} from './use-operator-toggle';
import {useOperators} from '../../use-operators';
import {FormFactor} from '@atb/api/types/generated/mobility-types_v2';
import {ThemeText} from '@atb/components/text';
import {useFilterStyle} from '@atb/mobility/components/filter/use-filter-style';
import {View, ViewStyle} from 'react-native';
import {SvgProps} from 'react-native-svg';
import {FormFactorFilterType} from '@atb/components/map';

type Props = {
  formFactor: FormFactor;
  icon: (props: SvgProps) => JSX.Element;
  initialFilter: FormFactorFilterType | undefined;
  onFilterChange: (filter: FormFactorFilterType) => void;
  style?: ViewStyle;
};

export const FormFactorFilter = ({
  icon,
  formFactor,
  initialFilter,
  onFilterChange,
  style,
}: Props) => {
  const {t} = useTranslation();
  const filterStyle = useFilterStyle();
  const allOperators = useOperators();
  const operators = allOperators(formFactor);
  const {showAll, isChecked, onAllToggle, onOperatorToggle} = useOperatorToggle(
    operators,
    initialFilter,
    onFilterChange,
  );

  return (
    <View style={style}>
      <ThemeText style={filterStyle.sectionHeader} type={'body__secondary'}>
        {t(MobilityTexts.formFactor(formFactor))}
      </ThemeText>
      <Section style={style}>
        {operators.length !== 1 && (
          <ToggleSectionItem
            text={t(MobilityTexts.filter.selectAll)}
            value={showAll()}
            onValueChange={onAllToggle}
          />
        )}
        {operators.map((operator) => (
          <ToggleSectionItem
            key={operator.id}
            text={operator.name}
            leftIcon={icon}
            value={isChecked(operator.id)}
            onValueChange={onOperatorToggle(operator.id)}
          />
        ))}
      </Section>
    </View>
  );
};
