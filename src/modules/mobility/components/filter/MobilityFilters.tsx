import React, {useState} from 'react';
import {StyleSheet} from '@atb/theme';
import {FormFactorFilterType, MobilityMapFilterType} from '@atb/modules/map';
import {FormFactor} from '@atb/api/types/generated/mobility-types_v2';
import {Section} from '@atb/components/sections';
import {ContentHeading} from '@atb/components/heading';
import {useTranslation} from '@atb/translations';
import {MobilityTexts} from '@atb/translations/screens/subscreens/MobilityTexts';
import {FormFactorFilterSectionItem} from './FormFactorFilterSectionItem';
import {useMapFilterFormFactors} from './use-map-filter-form-factors';

type Props = {
  filter: MobilityMapFilterType;
  onFilterChanged: (filter: MobilityMapFilterType) => void;
};

export const MobilityFilters = ({filter, onFilterChanged}: Props) => {
  const styles = useStyle();
  const {t} = useTranslation();
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

  const listedFormFactors = useMapFilterFormFactors();

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
  },
}));
