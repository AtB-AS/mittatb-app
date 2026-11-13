import React from 'react';
import {dictionary, useTranslation} from '@atb/translations';
import {StyleSheet, useThemeContext} from '@atb/theme';
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
  ShmoWarnings,
} from '@atb/translations/screens/subscreens/MobilityTexts';
import {formatReopensAt} from '../utils';
import {TransportationIconBox} from '@atb/components/icon-box';
import {
  FormFactor,
  PropulsionType,
} from '@atb/api/types/generated/mobility-types_v2';
import {screenReaderPause, ThemeText} from '@atb/components/text';
import {ThemeIcon} from '@atb/components/theme-icon';
import {ShmoHelpParams} from '@atb/stacks-hierarchy';
import {useVehiclesByVehicleTypeIdsQueries} from '../queries/use-vehicles-by-vehicle-type-ids-queries';
import {MessageInfoBox} from '@atb/components/message-info-box';
import {Loading} from '@atb/components/loading';
import {useQueryClient} from '@tanstack/react-query';
import {getVehicleQueryKey} from '../queries/use-vehicle-query';
import {SupportButton} from './SupportButton';
import {ThemedParkingIcon} from '@atb/theme/ThemedAssets';

type Props = {
  station: Station;
  operatorName: string;
  navigateSupportCallback: (params: ShmoHelpParams) => void;
  onPressVehicleType: (
    isStationBasedBooking: boolean,
    vehicleId?: string,
    vehicleTypeId?: string,
    stationId?: string,
  ) => void;
};

export const BikeStationIntegrationView = ({
  station,
  operatorName,
  navigateSupportCallback,
  onPressVehicleType,
}: Props) => {
  const {t, language} = useTranslation();
  const {theme} = useThemeContext();
  const queryClient = useQueryClient();
  const styles = useStyles();
  const vehicleTypesAvailable = station?.vehicleTypesAvailable;
  const vehicleTypeIds =
    vehicleTypesAvailable?.map((e) => e.vehicleType.id) ?? [];

  const hasNoAvailableVehicles =
    vehicleTypesAvailable?.every((e) => e.count === 0) ?? false;
  const vehicleQueries = useVehiclesByVehicleTypeIdsQueries(
    vehicleTypeIds,
    station?.id,
    '-currentRangeMeters',
    1,
  );

  const isLoading = vehicleQueries.some((q) => q.isLoading);
  const isError = vehicleQueries.some((q) => q.isError);

  const openingTime = station.openingHoursStatus?.openingTime
    ? formatReopensAt(station.openingHoursStatus.openingTime, language, t)
    : undefined;

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
        {station.openingHoursStatus?.isClosed && (
          <MessageInfoBox
            type="info"
            message={t(ShmoWarnings.operatorClosed(operatorName, openingTime))}
          />
        )}
        {hasNoAvailableVehicles && (
          <MessageInfoBox
            type="warning"
            message={t(BicycleTexts.stations.noBikesAvailable)}
          />
        )}
        {!!vehicleTypesAvailable?.length && (
          <Section>
            {vehicleTypesAvailable.map((e, index) => {
              const vehicleTypeName = t(
                MobilityTexts.vehicleName(
                  e.vehicleType.formFactor ?? FormFactor.Bicycle,
                  false,
                  e.vehicleType.propulsionType,
                ),
              );
              const availabilityText = t(
                MobilityTexts.freeBikes(e.count.toString()),
              );
              const icon = (
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
              );

              return e.count === 0 ? (
                <GenericSectionItem
                  key={index}
                  accessibility={{
                    accessible: true,
                    accessibilityLabel:
                      vehicleTypeName + screenReaderPause + availabilityText,
                  }}
                >
                  <View style={styles.vehicleType}>
                    {icon}
                    <View style={styles.vehicleTypeTexts}>
                      <ThemeText color={theme.color.surface.neutral.strong}>
                        {vehicleTypeName}
                      </ThemeText>
                      <ThemeText type="secondary" typography="body__s">
                        {availabilityText}
                      </ThemeText>
                    </View>
                  </View>
                </GenericSectionItem>
              ) : (
                <LinkSectionItem
                  key={index}
                  text={vehicleTypeName}
                  subtitle={availabilityText}
                  leftElement={icon}
                  buttonTextRight={t(dictionary.select)}
                  onPress={() => {
                    const vehicle =
                      vehicleQueries[vehicleTypeIds.indexOf(e.vehicleType.id)]
                        ?.data?.[0];

                    if (vehicle?.id) {
                      queryClient.setQueryData(
                        getVehicleQueryKey(vehicle.id),
                        vehicle,
                      );
                      onPressVehicleType(false, vehicle.id);
                    } else {
                      onPressVehicleType(
                        true,
                        undefined,
                        e.vehicleType.id,
                        station.id,
                      );
                    }
                  }}
                />
              );
            })}
          </Section>
        )}
        <Section>
          <GenericSectionItem style={styles.freeParkingSection}>
            <ThemeIcon svg={ThemedParkingIcon} size="large" />
            <ThemeText>
              {t(
                MobilityTexts.freeBikeParkingSpaces(
                  station?.numDocksAvailable ?? 0,
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
                systemId: station?.system.id,
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
    vehicleType: {
      flex: 1,
      flexDirection: 'row',
      alignItems: 'center',
      gap: theme.spacing.small,
    },
    vehicleTypeTexts: {
      flex: 1,
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
