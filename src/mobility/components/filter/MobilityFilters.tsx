import {ScooterFilter} from '@atb/mobility/components/filter/ScooterFilter';
import {BikeFilter} from '@atb/mobility/components/filter/BikeFilter';
import {CarFilter} from '@atb/mobility/components/filter/CarFilter';
import {Section} from '@atb/components/sections';
import React from 'react';
import {useIsCityBikesEnabled, useIsVehiclesEnabled} from '@atb/mobility';
import {useIsCarSharingEnabled} from '@atb/mobility/use-car-sharing-enabled';
import {OperatorFilterType} from '@atb/components/map';
import {StyleSheet} from '@atb/theme';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

type Props = {
  scooters: OperatorFilterType | undefined;
  bikeStations: OperatorFilterType | undefined;
  carSharingStations: OperatorFilterType | undefined;
  onScootersChanged: (operatorFilter: OperatorFilterType) => void;
  onBikeStationsChanged: (operatorFilter: OperatorFilterType) => void;
  onCarSharingStationsChanged: (operatorFilter: OperatorFilterType) => void;
};

export const MobilityFilters = ({
  scooters,
  bikeStations,
  carSharingStations,
  onScootersChanged,
  onBikeStationsChanged,
  onCarSharingStationsChanged,
}: Props) => {
  const style = useStyle();
  const isVehiclesEnabled = useIsVehiclesEnabled();
  const isCityBikesEnabled = useIsCityBikesEnabled();
  const isCarSharingEnabled = useIsCarSharingEnabled();

  return (
    <Section>
      {isVehiclesEnabled && (
        <ScooterFilter
          initialFilter={scooters}
          onFilterChange={onScootersChanged}
        />
      )}
      {isCityBikesEnabled && (
        <BikeFilter
          style={style.filterGroup}
          initialFilter={bikeStations}
          onFilterChange={onBikeStationsChanged}
        />
      )}
      {isCarSharingEnabled && (
        <CarFilter
          style={style.filterGroup}
          initialFilter={carSharingStations}
          onFilterChange={onCarSharingStationsChanged}
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
