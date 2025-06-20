import {Section, ToggleSectionItem} from '@atb/components/sections';
import {MobilityTexts} from '@atb/translations/screens/subscreens/MobilityTexts';
import React from 'react';
import {useTranslation} from '@atb/translations';
import {useOperatorToggle} from './use-operator-toggle';
import {useOperators} from '../../use-operators';
import {FormFactor} from '@atb/api/types/generated/mobility-types_v2';
import {View, ViewStyle} from 'react-native';
import {FormFactorFilterType} from '@atb/modules/map';
import {ContentHeading} from '@atb/components/heading';
import {StyleSheet} from '@atb/theme';
import {ThemeIcon} from '@atb/components/theme-icon';
import {getTransportModeSvg} from '@atb/components/icon-box';
import {getModeAndSubModeFromFormFactor} from '../../utils';

type Props = {
  formFactor: FormFactor;
  initialFilter: FormFactorFilterType | undefined;
  onFilterChange: (filter: FormFactorFilterType) => void;
  style?: ViewStyle;
};

export const FormFactorFilter = ({
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
            testID={`${formFactor.toLowerCase()}ToggleAll`}
          />
        )}
        {operators.map((operator) => (
          <ToggleSectionItem
            key={operator.id}
            text={operator.name}
            leftImage={
              <ThemeIcon
                svg={
                  getTransportModeSvg(
                    getModeAndSubModeFromFormFactor(formFactor).mode,
                    getModeAndSubModeFromFormFactor(formFactor)?.subMode,
                  ).svg
                }
              />
            }
            value={isChecked(operator.id)}
            onValueChange={onOperatorToggle(operator.id)}
            testID={`${operator.name.toLowerCase().replace(' ', '')}Toggle`}
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
