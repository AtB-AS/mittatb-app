import React from 'react';
import {useTranslation} from '@atb/translations';
import {StyleSheet} from '@atb/theme';
import {View} from 'react-native';
import {Station} from '@atb/api/types/mobility';
import {
  GenericSectionItem,
  LinkSectionItem,
  Section,
} from '@atb/components/sections';
import {
  BicycleTexts,
  MobilityTexts,
} from '@atb/translations/screens/subscreens/MobilityTexts';
import {TransportationIconBox} from '@atb/components/icon-box';
import {
  FormFactor,
  PropulsionType,
} from '@atb/api/types/generated/mobility-types_v2';
import {ThemeText} from '@atb/components/text';
import {ThemeIcon} from '@atb/components/theme-icon';
import {ShmoHelpParams} from '@atb/stacks-hierarchy';
import {useVehiclesByVehicleTypeIdsQueries} from '../queries/use-vehicles-by-vehicle-type-ids-queries';
import {MessageInfoBox} from '@atb/components/message-info-box';
import {Loading} from '@atb/components/loading';
import {useQueryClient} from '@tanstack/react-query';
import {Vehicle} from '@atb/api/types/mobility';
import {
  getVehicleQueryKey,
  MOCK_VEHICLE_ID,
} from '../queries/use-vehicle-query';
import {SupportButton} from './SupportButton';
import {ThemedCityBikeStation, ThemedParkingIcon} from '@atb/theme/ThemedAssets';

type Props = {
  station: Station;
  navigateSupportCallback: (params: ShmoHelpParams) => void;
  onPressVehicleType: (
    vehicleId: string,
    isStationBasedBooking: boolean,
  ) => void;
};

export const BikeStationIntegrationView = ({
  station,
  navigateSupportCallback,
  onPressVehicleType,
}: Props) => {
  const {t} = useTranslation();
  const queryClient = useQueryClient();
  const styles = useStyles();
  const vehicleTypeIds = (station?.vehicleTypesAvailable ?? []).map(
    (e) => e.vehicleType.id,
  );
  const vehicleQueries = useVehiclesByVehicleTypeIdsQueries(
    vehicleTypeIds,
    station?.id,
    '-currentRangeMeters',
    1,
  );

  const isLoading = vehicleQueries.some((q) => q.isLoading);
  const isError = vehicleQueries.some((q) => q.isError);

  if (isLoading) {
    return (
      <View style={styles.loading}>
        <Loading size="large" />
      </View>
    );
  }

  return (
    <>
      {!isLoading && isError && (
        <View style={styles.error}>
          <MessageInfoBox
            type="error"
            message={t(BicycleTexts.loadingFailedBicyclesStations)}
          />
        </View>
      )}

      <View style={styles.container}>
        <View style={styles.illustration}>
          <ThemedCityBikeStation />
        </View>
        <Section>
          {station?.vehicleTypesAvailable
            ?.filter((e) => {
              if (e.count > 0) return true;
            })
            .map((e, index) => (
              <LinkSectionItem
                key={index}
                text={t(
                  MobilityTexts.vehicleName(
                    e.vehicleType.formFactor ?? FormFactor.Bicycle,
                    false,
                    e.vehicleType.propulsionType,
                  ),
                )}
                subtitle={t(MobilityTexts.freeBikes(e.count.toString()))}
                leftElement={
                  <TransportationIconBox
                    mode="bicycle"
                    subMode={
                      e.vehicleType.propulsionType ===
                        PropulsionType.ElectricAssist ||
                      e.vehicleType.propulsionType === PropulsionType.Electric
                        ? 'ebicycle'
                        : undefined
                    }
                    rounded={true}
                  />
                }
                onPress={() => {
                  const vehicle =
                    vehicleQueries[vehicleTypeIds.indexOf(e.vehicleType.id)]
                      ?.data?.[0];

                  if (vehicle?.id) {
                    queryClient.setQueryData(
                      getVehicleQueryKey(vehicle.id),
                      vehicle,
                    );
                    onPressVehicleType(vehicle.id, false);
                  } else {
                    const mockVehicle: Vehicle = {
                      id: MOCK_VEHICLE_ID,
                      lat: station.lat,
                      lon: station.lon,
                      currentRangeMeters: 1000,
                      isReserved: false,
                      isDisabled: false,
                      pricingPlan: e.vehicleType.pricingPlans?.[0] ?? {
                        price: 0,
                        currency: 'NOK',
                      },
                      system: station.system,
                      station: {id: station.id},
                      vehicleType: {...e.vehicleType, name: {}},
                    };

                    queryClient.setQueryData(
                      getVehicleQueryKey(mockVehicle.id),
                      mockVehicle,
                    );
                    onPressVehicleType(mockVehicle.id, true);
                  }
                }}
              />
            ))}
        </Section>
        <Section>
          <GenericSectionItem style={styles.freeParkingSection}>
            <ThemeIcon svg={ThemedParkingIcon} size="large" />
            <ThemeText>
              {t(
                MobilityTexts.freeBikeParkingSpaces(
                  station?.numDocksAvailable?.toString() ?? '0',
                ),
              )}
            </ThemeText>
          </GenericSectionItem>
        </Section>
        <Section style={styles.supportSection}>
          <SupportButton
            navigateToSupport={() => {
              navigateSupportCallback({
                operatorId: station?.system.operator.id ?? '',
                stationId: station?.id ?? '',
                formFactor: FormFactor.Bicycle,
              });
            }}
          />
        </Section>
      </View>
    </>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => {
  return {
    container: {
      paddingHorizontal: theme.spacing.medium,
      paddingBottom: theme.spacing.medium,
      gap: theme.spacing.small,
    },
    illustration: {
      alignItems: 'center',
    },
    freeParkingSection: {
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.small,
    },
    loading: {
      marginBottom: theme.spacing.medium,
    },
    error: {
      marginBottom: theme.spacing.medium,
      marginHorizontal: theme.spacing.medium,
    },
    supportSection: {
      paddingTop: theme.spacing.xSmall,
    },
  };
});
