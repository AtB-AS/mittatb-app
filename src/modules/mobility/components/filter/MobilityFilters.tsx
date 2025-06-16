import {FormFactorFilter} from './FormFactorFilter';
import React, {useState} from 'react';
import {StyleSheet, useThemeContext} from '@atb/theme';
import {FormFactorFilterType, MobilityMapFilterType} from '@atb/modules/map';
import {FormFactor} from '@atb/api/types/generated/mobility-types_v2';
import {View} from 'react-native';
import {useFeatureTogglesContext} from '@atb/modules/feature-toggles';
import {Section} from '@atb/components/sections';
import {ContentHeading} from '@atb/components/heading';
import {useTranslation} from '@atb/translations';
import {MobilityTexts} from '@atb/translations/screens/subscreens/MobilityTexts';

type Props = {
  filter: MobilityMapFilterType;
  onFilterChanged: (filter: MobilityMapFilterType) => void;
};

export const MobilityFilters = ({filter, onFilterChanged}: Props) => {
  const styles = useStyle();
  const {theme} = useThemeContext();
  const {t} = useTranslation();
  const {
    isCarSharingInMapEnabled,
    isCityBikesInMapEnabled,
    isVehiclesInMapEnabled,
    isMapV2Enabled,
  } = useFeatureTogglesContext();
  const [mobilityFilter, setMobilityFilter] =
    useState<MobilityMapFilterType>(filter);

  const onFormFactorFilterChanged =
    (formFactor: FormFactor) => (filter: FormFactorFilterType) => {
      const newFilter = {
        ...mobilityFilter,
        [formFactor]: filter,
      };
      setMobilityFilter(newFilter);
      onFilterChanged(newFilter);
    };

  const listedFormFactors: FormFactor[] = [
    {
      shouldShow: isVehiclesInMapEnabled,
      formFactor: FormFactor.Scooter,
    },
    {
      shouldShow: isCityBikesInMapEnabled,
      formFactor: FormFactor.Bicycle,
    },
    {
      shouldShow: isCarSharingInMapEnabled,
      formFactor: FormFactor.Car,
    },
  ]
    .filter((f) => f.shouldShow)
    .map((f) => f.formFactor);

  const FormFactors = listedFormFactors.map((formFactor, i) => (
    <FormFactorFilter
      key={formFactor}
      isFirstSectionItem={i === 0}
      isLastSectionItem={i === listedFormFactors.length - 1}
      formFactor={formFactor}
      initialFilter={filter[formFactor]}
      onFilterChange={onFormFactorFilterChanged(formFactor)}
    />
  ));

  return isMapV2Enabled ? (
    <Section>
      <ContentHeading
        text={t(MobilityTexts.filter.sectionTitle.sharedMobility)}
        style={{marginBottom: theme.spacing.small}}
      />
      {FormFactors}
    </Section>
  ) : (
    <View style={styles.container}>{FormFactors}</View>
  );
};

const useStyle = StyleSheet.createThemeHook((theme) => ({
  container: {
    rowGap: theme.spacing.small,
  },
}));
