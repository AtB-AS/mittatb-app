import React from 'react';
import {useTranslation} from '@atb/translations';
import {StyleSheet} from '@atb/theme';
import {View} from 'react-native';
import {BikeStationFragment} from '@atb/api/types/generated/fragments/stations';
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
import {PropulsionType} from '@atb/api/types/generated/mobility-types_v2';
import SvgParking from '@atb/assets/svg/mono-icons/places/Parking';
import {ThemeText} from '@atb/components/text';
import {ThemeIcon} from '@atb/components/theme-icon';
import {ShmoHelpParams} from '@atb/stacks-hierarchy';
import {useVehiclesByPropulsionTypesQueries} from '../queries/use-vehicles-by-propulsion-types-queries';
import {MessageInfoBox} from '@atb/components/message-info-box';
import {Loading} from '@atb/components/loading';

type Props = {
  station: BikeStationFragment;
  navigateSupportCallback: (params: ShmoHelpParams) => void;
  onPressVehicleType: (vehicleId: string) => void;
};

export const BikeStationIntegrationView = ({
  station,
  navigateSupportCallback,
  onPressVehicleType,
}: Props) => {
  const {t} = useTranslation();
  const styles = useStyles();
  const {humanQuery, electricQuery, electricAssistQuery} =
    useVehiclesByPropulsionTypesQueries(
      station?.id, // stationId
      '-currentRangeMeters', // sort
      1, // maxCount
    );

  const isLoading = [humanQuery, electricQuery, electricAssistQuery].some(
    (q) => q.isLoading,
  );
  const isError = [humanQuery, electricQuery, electricAssistQuery].some(
    (q) => q.isError,
  );

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
        <Section>
          {station?.vehicleTypesAvailable
            ?.filter((e) => {
              if (e.count === 0) return false;

              switch (e.vehicleType.propulsionType) {
                case PropulsionType.Human:
                  return (humanQuery.data?.length ?? 0) > 0;
                case PropulsionType.Electric:
                  return (electricQuery.data?.length ?? 0) > 0;
                case PropulsionType.ElectricAssist:
                  return (electricAssistQuery.data?.length ?? 0) > 0;
                default:
                  return false;
              }
            })
            .map((e, index) => (
              <LinkSectionItem
                key={index}
                text={t(
                  MobilityTexts.bikeNameByPropulsionType(
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
                    isFlexible={false}
                    size="normal"
                    type="compact"
                    overrideBorderRadius="50%"
                  />
                }
                onPress={() => {
                  const vehicle = (() => {
                    switch (e.vehicleType.propulsionType) {
                      case PropulsionType.Human:
                        return humanQuery.data?.[0];
                      case PropulsionType.Electric:
                        return electricQuery.data?.[0];
                      case PropulsionType.ElectricAssist:
                        return electricAssistQuery.data?.[0];
                    }
                  })();

                  if (vehicle?.id) {
                    // sanity check, already handled in the filter, but atleast prevents crashes if something unexpected happens
                    onPressVehicleType(vehicle.id);
                  }
                }}
              />
            ))}
        </Section>
        <Section>
          <GenericSectionItem style={styles.freeParkingSection}>
            <ThemeIcon svg={SvgParking} size="large" />
            <ThemeText>
              {t(
                MobilityTexts.freeBikeParkingSpaces(
                  station?.numDocksAvailable?.toString() ?? '0',
                ),
              )}
            </ThemeText>
          </GenericSectionItem>
        </Section>
        <Section>
          <LinkSectionItem
            text={t(MobilityTexts.helpText)}
            onPress={() =>
              navigateSupportCallback({
                operatorId: station?.system.operator.id ?? '',
                stationId: station?.id ?? '',
              })
            }
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
      gap: theme.spacing.medium,
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
  };
});
