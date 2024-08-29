import {Section, ToggleSectionItem} from '@atb/components/sections';
import {MobilityTexts} from '@atb/translations/screens/subscreens/MobilityTexts';
import React from 'react';
import {useTranslation} from '@atb/translations';
import {useOperatorToggle} from './use-operator-toggle';
import {useOperators} from '../../use-operators';
import {FormFactor} from '@atb/api/types/generated/mobility-types_v2';
import {View, ViewStyle} from 'react-native';
import {SvgProps} from 'react-native-svg';
import {FormFactorFilterType} from '@atb/components/map';
import {ContentHeading} from '@atb/components/heading';
import {StyleSheet} from '@atb/theme';
import {ThemeIcon} from '@atb/components/theme-icon';

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
  const styles = useStyle();
  const operators = useOperators().byFormFactor(formFactor);
  const {showAll, isChecked, onAllToggle, onOperatorToggle} = useOperatorToggle(
    operators,
    initialFilter,
    onFilterChange,
  );

  return (
    <View style={[style, styles.container]}>
      <ContentHeading text={t(MobilityTexts.formFactor(formFactor))} />
      <Section>
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
            leftImage={<ThemeIcon svg={icon} />}
            value={isChecked(operator.id)}
            onValueChange={onOperatorToggle(operator.id)}
          />
        ))}
      </Section>
    </View>
  );
};

export const useStyle = StyleSheet.createThemeHook((theme) => ({
  container: {
    rowGap: theme.spacing.small,
  },
}));
