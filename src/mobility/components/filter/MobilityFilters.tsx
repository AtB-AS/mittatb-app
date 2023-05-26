import {ScooterFilter} from '@atb/mobility/components/filter/ScooterFilter';
import {BikeFilter} from '@atb/mobility/components/filter/BikeFilter';
import {CarFilter} from '@atb/mobility/components/filter/CarFilter';
import {Section} from '@atb/components/sections';
import React, {useEffect, useState} from 'react';
import {useIsCityBikesEnabled, useIsVehiclesEnabled} from '@atb/mobility';
import {useIsCarSharingEnabled} from '@atb/mobility/use-car-sharing-enabled';
import {MapFilterType, OperatorFilterType} from '@atb/components/map';
import {StyleSheet} from '@atb/theme';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

type Props = {
  initialFilter: MapFilterType;
  onFilterChanged: (filter: MapFilterType) => void;
};

export const MobilityFilters = ({initialFilter, onFilterChanged}: Props) => {
  const style = useStyle();
  const isVehiclesEnabled = useIsVehiclesEnabled();
  const isCityBikesEnabled = useIsCityBikesEnabled();
  const isCarSharingEnabled = useIsCarSharingEnabled();
  const [filter, setFilter] = useState<MapFilterType>();

  useEffect(() => {
    setFilter(initialFilter);
  }, [initialFilter]);

  const onScooterFilterChanged = (operatorFilter: OperatorFilterType) => {
    const newFilter = {
      ...filter,
      vehicles: {
        ...filter?.vehicles,
        scooters: operatorFilter,
      },
    };
    setFilter(newFilter);
    onFilterChanged(newFilter);
  };

  const onBikeFilterChanged = (operatorFilter: OperatorFilterType) => {
    const newFilter = {
      ...filter,
      stations: {
        ...filter?.stations,
        cityBikeStations: operatorFilter,
      },
    };
    setFilter(newFilter);
    onFilterChanged(newFilter);
  };

  const onCarFilterChanged = (operatorFilter: OperatorFilterType) => {
    const newFilter = {
      ...filter,
      stations: {
        ...filter?.stations,
        carSharingStations: operatorFilter,
      },
    };
    setFilter(newFilter);
    onFilterChanged(newFilter);
  };

  return (
    <Section>
      {isVehiclesEnabled && (
        <ScooterFilter
          initialFilter={initialFilter.vehicles?.scooters}
          onFilterChange={onScooterFilterChanged}
        />
      )}
      {isCityBikesEnabled && (
        <BikeFilter
          style={style.filterGroup}
          initialFilter={initialFilter.stations?.cityBikeStations}
          onFilterChange={onBikeFilterChanged}
        />
      )}
      {isCarSharingEnabled && (
        <CarFilter
          style={style.filterGroup}
          initialFilter={initialFilter.stations?.cityBikeStations}
          onFilterChange={onCarFilterChanged}
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
      marginTop: theme.spacings.medium,
    },
  };
});
