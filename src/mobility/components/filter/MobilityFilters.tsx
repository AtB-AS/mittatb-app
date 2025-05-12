import {FormFactorFilter} from '@atb/mobility/components/filter/FormFactorFilter';
import React, {useState} from 'react';
import {StyleSheet} from '@atb/theme';
import {
  Bicycle,
  Car,
  Scooter,
} from '@atb/assets/svg/mono-icons/transportation-entur';
import {FormFactorFilterType, MobilityMapFilterType} from '@atb/modules/map';
import {FormFactor} from '@atb/api/types/generated/mobility-types_v2';
import {View} from 'react-native';
import {useFeatureTogglesContext} from '@atb/modules/feature-toggles';

type Props = {
  filter: MobilityMapFilterType;
  onFilterChanged: (filter: MobilityMapFilterType) => void;
};

export const MobilityFilters = ({filter, onFilterChanged}: Props) => {
  const styles = useStyle();
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

  return (
    <View style={styles.container}>
      {isVehiclesInMapEnabled && (
        <FormFactorFilter
          formFactor={FormFactor.Scooter}
          icon={Scooter}
          initialFilter={filter[FormFactor.Scooter]}
          onFilterChange={onFormFactorFilterChanged(FormFactor.Scooter)}
        />
      )}
      {isCityBikesInMapEnabled && (
        <FormFactorFilter
          formFactor={FormFactor.Bicycle}
          icon={Bicycle}
          initialFilter={filter[FormFactor.Bicycle]}
          onFilterChange={onFormFactorFilterChanged(FormFactor.Bicycle)}
        />
      )}
      {isCarSharingInMapEnabled && (
        <FormFactorFilter
          formFactor={FormFactor.Car}
          icon={Car}
          initialFilter={filter[FormFactor.Car]}
          onFilterChange={onFormFactorFilterChanged(FormFactor.Car)}
        />
      )}
    </View>
  );
};

const useStyle = StyleSheet.createThemeHook((theme) => ({
  container: {
    rowGap: theme.spacing.small,
  },
}));
