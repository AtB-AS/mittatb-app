import {FormFactorFilter} from '@atb/mobility/components/filter/FormFactorFilter';
import {Section} from '@atb/components/sections';
import React, {useState} from 'react';
import {useIsCityBikesEnabled, useIsVehiclesEnabled} from '@atb/mobility';
import {useIsCarSharingEnabled} from '@atb/mobility/use-car-sharing-enabled';
import {StyleSheet} from '@atb/theme';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {
  Scooter,
  Bicycle,
  Car,
} from '@atb/assets/svg/mono-icons/transportation-entur';
import {FormFactorFilterType, MobilityMapFilterType} from '@atb/components/map';
import {FormFactor} from '@atb/api/types/generated/mobility-types_v2';

type Props = {
  filter: MobilityMapFilterType;
  onFilterChanged: (filter: MobilityMapFilterType) => void;
};

export const MobilityFilters = ({filter, onFilterChanged}: Props) => {
  const style = useStyle();
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
    <Section>
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
          style={style.filterGroup}
          formFactor={FormFactor.Bicycle}
          icon={Bicycle}
          initialFilter={filter[FormFactor.Bicycle]}
          onFilterChange={onFormFactorFilterChanged(FormFactor.Bicycle)}
        />
      )}
      {isCarSharingEnabled && (
        <FormFactorFilter
          style={style.filterGroup}
          formFactor={FormFactor.Car}
          icon={Car}
          initialFilter={filter[FormFactor.Car]}
          onFilterChange={onFormFactorFilterChanged(FormFactor.Car)}
        />
      )}
    </Section>
  );
};

const useStyle = StyleSheet.createThemeHook((theme) => {
  const {bottom} = useSafeAreaInsets();
  return {
    activityIndicator: {
      marginBottom: Math.max(bottom, theme.spacings.medium),
    },
    container: {
      marginHorizontal: theme.spacings.medium,
      marginBottom: theme.spacings.medium,
    },
    filterGroup: {
      marginTop: theme.spacings.large,
    },
  };
});
