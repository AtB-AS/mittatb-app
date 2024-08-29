import {FormFactorFilter} from '@atb/mobility/components/filter/FormFactorFilter';
import React, {useState} from 'react';
import {useIsCityBikesEnabled, useIsVehiclesEnabled} from '@atb/mobility';
import {useIsCarSharingEnabled} from '@atb/mobility/use-car-sharing-enabled';
import {StyleSheet} from '@atb/theme';
import {
  Bicycle,
  Car,
  Scooter,
} from '@atb/assets/svg/mono-icons/transportation-entur';
import {FormFactorFilterType, MobilityMapFilterType} from '@atb/components/map';
import {FormFactor} from '@atb/api/types/generated/mobility-types_v2';
import {View} from 'react-native';

type Props = {
  filter: MobilityMapFilterType;
  onFilterChanged: (filter: MobilityMapFilterType) => void;
};

export const MobilityFilters = ({filter, onFilterChanged}: Props) => {
  const styles = useStyle();
  const isVehiclesEnabled = useIsVehiclesEnabled();
  const isCityBikesEnabled = useIsCityBikesEnabled();
  const isCarSharingEnabled = useIsCarSharingEnabled();
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
      {isVehiclesEnabled && (
        <FormFactorFilter
          formFactor={FormFactor.Scooter}
          icon={Scooter}
          initialFilter={filter[FormFactor.Scooter]}
          onFilterChange={onFormFactorFilterChanged(FormFactor.Scooter)}
        />
      )}
      {isCityBikesEnabled && (
        <FormFactorFilter
          formFactor={FormFactor.Bicycle}
          icon={Bicycle}
          initialFilter={filter[FormFactor.Bicycle]}
          onFilterChange={onFormFactorFilterChanged(FormFactor.Bicycle)}
        />
      )}
      {isCarSharingEnabled && (
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
