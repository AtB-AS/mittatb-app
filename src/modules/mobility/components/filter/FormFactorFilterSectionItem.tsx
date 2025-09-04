import {
  SectionItemProps,
  useSectionItem,
  useSectionStyle,
} from '@atb/components/sections';
import {MobilityTexts} from '@atb/translations/screens/subscreens/MobilityTexts';
import React from 'react';
import {useTranslation} from '@atb/translations';
import {useOperatorToggle} from './use-operator-toggle';
import {useOperators} from '../../use-operators';
import {FormFactor} from '@atb/api/types/generated/mobility-types_v2';
import {FormFactorFilterType} from '@atb/modules/map';
import {TransportationIconBox} from '@atb/components/icon-box';
import {getModeAndSubModeFromFormFactor} from './../../utils';
import {View} from 'react-native';
import {StyleSheet, Theme} from '@atb/theme';
import {ThemeText} from '@atb/components/text';
import {Toggle} from '@atb/components/toggle';

type FormFactorFilterSectionItemProps = SectionItemProps<{
  formFactor: FormFactor;
  initialFilter: FormFactorFilterType | undefined;
  onFilterChange: (filter: FormFactorFilterType) => void;
  isFirstSectionItem?: boolean;
  isLastSectionItem?: boolean;
}>;

export const FormFactorFilterSectionItem = (
  props: FormFactorFilterSectionItemProps,
) => {
  const {formFactor, initialFilter, onFilterChange} = props;
  const {t} = useTranslation();
  const {topContainer} = useSectionItem(props);
  const sectionStyle = useSectionStyle();
  const styles = useStyles();
  const operators = useOperators().byFormFactor(formFactor);
  const {showAll, onAllToggle} = useOperatorToggle(
    operators,
    initialFilter,
    onFilterChange,
  );
  return (
    <View style={topContainer}>
      <View style={{flexDirection: 'row'}}>
        <View style={styles.leftImageContainer}>
          <TransportationIconBox
            mode={getModeAndSubModeFromFormFactor(formFactor).mode}
            subMode={getModeAndSubModeFromFormFactor(formFactor)?.subMode}
          />
        </View>
        <View style={styles.contentContainer}>
          <View style={sectionStyle.spaceBetween}>
            <View style={styles.textContainer}>
              <ThemeText>
                {t(MobilityTexts.formFactor(formFactor, true))}
              </ThemeText>
            </View>
            <Toggle
              value={showAll()}
              onValueChange={onAllToggle}
              testID={`${formFactor.toLowerCase()}Toggle`}
            />
          </View>
        </View>
      </View>
    </View>
  );
};

const useStyles = StyleSheet.createThemeHook((theme: Theme) => ({
  leftImageContainer: {
    marginRight: theme.spacing.small,
    justifyContent: 'center',
  },
  contentContainer: {
    flexDirection: 'column',
    flex: 1,
    gap: theme.spacing.small,
  },
  textContainer: {flex: 1, marginRight: theme.spacing.small},
}));
