import React, {useState} from 'react';
import {StyleSheet} from '@atb/theme';
import {FormFactorFilterType, MobilityMapFilterType} from '@atb/modules/map';
import {FormFactor} from '@atb/api/types/generated/mobility-types_v2';
import {useFeatureTogglesContext} from '@atb/modules/feature-toggles';
import {Section} from '@atb/components/sections';
import {ContentHeading} from '@atb/components/heading';
import {useTranslation} from '@atb/translations';
import {MobilityTexts} from '@atb/translations/screens/subscreens/MobilityTexts';
import {FormFactorFilterSectionItem} from './FormFactorFilterSectionItem';

type Props = {
  filter: MobilityMapFilterType;
  onFilterChanged: (filter: MobilityMapFilterType) => void;
};

export const MobilityFilters = ({filter, onFilterChanged}: Props) => {
  const styles = useStyle();
  const {t} = useTranslation();
  const {
    isCarSharingInMapEnabled,
    isCityBikesInMapEnabled,
    isVehiclesInMapEnabled,
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

  return (
    <>
      <ContentHeading
        text={t(MobilityTexts.filter.sectionTitle.sharedMobility)}
        style={styles.contentHeading}
      />
      <Section>
        {listedFormFactors.map((formFactor) => (
          <FormFactorFilterSectionItem
            key={formFactor}
            formFactor={formFactor}
            initialFilter={filter[formFactor]}
            onFilterChange={onFormFactorFilterChanged(formFactor)}
          />
        ))}
      </Section>
    </>
  );
};

const useStyle = StyleSheet.createThemeHook((theme) => ({
  container: {
    rowGap: theme.spacing.small,
  },
  contentHeading: {
    marginBottom: theme.spacing.small,
    marginHorizontal: 0,
  },
}));
