import {Section, ToggleSectionItem} from '@atb/components/sections';
import {MobilityTexts} from '@atb/translations/screens/subscreens/MobilityTexts';
import React from 'react';
import {useTranslation} from '@atb/translations';
import {useOperatorToggle} from './use-operator-toggle';
import {useOperators} from '../../use-operators';
import {FormFactor} from '@atb/api/types/generated/mobility-types_v2';
import {View, ViewStyle} from 'react-native';
import {SvgProps} from 'react-native-svg';
import {FormFactorFilterType} from '@atb/modules/map';
import {ContentHeading} from '@atb/components/heading';
import {StyleSheet} from '@atb/theme';
import {ThemeIcon} from '@atb/components/theme-icon';
import {useFeatureTogglesContext} from '@atb/modules/feature-toggles';

type Props = {
  formFactor: FormFactor;
  icon: (props: SvgProps) => JSX.Element;
  initialFilter: FormFactorFilterType | undefined;
  onFilterChange: (filter: FormFactorFilterType) => void;
  style?: ViewStyle;
  isFirstSectionItem?: boolean;
  isLastSectionItem?: boolean;
};

export const FormFactorFilter = ({
  icon,
  formFactor,
  initialFilter,
  onFilterChange,
  style,
  isFirstSectionItem,
  isLastSectionItem,
}: Props) => {
  const {t} = useTranslation();
  const styles = useStyle();
  const operators = useOperators().byFormFactor(formFactor);
  const {showAll, isChecked, onAllToggle, onOperatorToggle} = useOperatorToggle(
    operators,
    initialFilter,
    onFilterChange,
  );

  const {isMapV2Enabled} = useFeatureTogglesContext();

  if (isMapV2Enabled) {
    return (
      <View style={style}>
        <ToggleSectionItem
          text={t(MobilityTexts.filter.toggleTitle(formFactor))}
          value={showAll()}
          onValueChange={onAllToggle}
          testID={`${formFactor.toLowerCase()}ToggleAll`}
          radius={
            isFirstSectionItem && isLastSectionItem
              ? 'top-bottom'
              : isFirstSectionItem
              ? 'top'
              : isLastSectionItem
              ? 'bottom'
              : undefined
          }
        />
      </View>
    );
  } else {
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
              leftImage={<ThemeIcon svg={icon} />}
              value={isChecked(operator.id)}
              onValueChange={onOperatorToggle(operator.id)}
              testID={`${operator.name.toLowerCase().replace(' ', '')}Toggle`}
            />
          ))}
        </Section>
      </View>
    );
  }
};

export const useStyle = StyleSheet.createThemeHook((theme) => ({
  container: {
    rowGap: theme.spacing.small,
  },
}));
