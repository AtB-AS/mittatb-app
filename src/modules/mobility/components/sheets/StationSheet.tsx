import {Station} from '@atb/api/types/mobility';
import {
  BottomSheetHeaderType,
  MapBottomSheet,
} from '@atb/components/bottom-sheet';
import {TransportationIconBox} from '@atb/components/icon-box';
import {MessageInfoBox} from '@atb/components/message-info-box';
import {StyleSheet, useThemeContext} from '@atb/theme';
import {useVehiclesByVehicleTypeIdsQueries} from '../../queries/use-vehicles-by-vehicle-type-ids-queries';
import {useQueryClient} from '@tanstack/react-query';
import {
  formatReopensAt,
  getTransportModeAndSubMode,
  isBicycleFormFactor,
} from '../../utils';
import {dictionary, useTranslation} from '@atb/translations';
import {
  MobilityTexts,
  ShmoWarnings,
  StationTexts,
} from '@atb/translations/screens/subscreens/MobilityTexts';
import React from 'react';
import {View} from 'react-native';
import {useStation} from '../../use-station';
import {useDoOnceOnItemReceived} from '../../use-do-once-on-item-received';
import {ShmoHelpParams} from '@atb/stacks-hierarchy';
import {useOperators} from '../../use-operators';
import {Loading} from '@atb/components/loading';
import {BrandingImage} from '../BrandingImage';
import {
  GenericSectionItem,
  LinkSectionItem,
  Section,
} from '@atb/components/sections';
import {screenReaderPause, ThemeText} from '@atb/components/text';
import {getVehicleQueryKey} from '../../queries/use-vehicle-query';
import {ThemedParkingIcon} from '@atb/theme/ThemedAssets';
import {ThemeIcon} from '@atb/components/theme-icon';
import {SupportButton} from '../SupportButton';
import {VehicleImage} from '../VehicleImage';

type Props = {
  stationId: string;
  onClose: () => void;
  onStationReceived?: (station: Station) => void;
  locationArrowOnPress: () => void;
  navigateToScanQrCode: () => void;
  navigateSupportCallback: (params: ShmoHelpParams) => void;
  onVehicleTypeSelected: (
    isStationBasedBooking: boolean,
    vehicleId?: string,
    vehicleTypeId?: string,
    stationId?: string,
  ) => void;
};

export const StationSheet = ({
  stationId,
  onClose,
  onStationReceived,
  locationArrowOnPress,
  navigateToScanQrCode,
  navigateSupportCallback,
  onVehicleTypeSelected,
}: Props) => {
  const {t, language} = useTranslation();
  const styles = useSheetStyle();
  const {theme} = useThemeContext();
  const queryClient = useQueryClient();

  const {
    isLoading,
    isError,
    station,
    stationName,
    operatorName,
    operatorId,
    formFactor,
    propulsionType,
  } = useStation(stationId);

  const operator = useOperators().byId(operatorId);
  const operatorLogoUrl = operator?.brandAssets?.brandImageUrl;
  const {mode, subMode} = getTransportModeAndSubMode(
    formFactor,
    propulsionType,
  );

  useDoOnceOnItemReceived(onStationReceived, station);

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

  const isLoadingVehicles = vehicleQueries.some((q) => q.isLoading);
  const isErrorVehicles = vehicleQueries.some((q) => q.isError);

  const openingTime = station?.openingHoursStatus?.openingTime
    ? formatReopensAt(station.openingHoursStatus.openingTime, language, t)
    : undefined;

  return (
    <MapBottomSheet
      canMinimize={true}
      enablePanDownToClose={false}
      closeCallback={onClose}
      closeOnBackdropPress={false}
      allowBackgroundTouch={true}
      enableDynamicSizing={true}
      heading={stationName}
      subText={operatorName}
      bottomSheetHeaderType={BottomSheetHeaderType.Close}
      logoIcon={
        isLoading ? null : (
          <BrandingImage
            logoUrl={operatorLogoUrl}
            logoSize={28}
            fallback={<TransportationIconBox mode={mode} subMode={subMode} />}
          />
        )
      }
      locationArrowOnPress={locationArrowOnPress}
      navigateToScanQrCode={navigateToScanQrCode}
    >
      {(isLoading || isLoadingVehicles) && (
        <View style={styles.loading}>
          <Loading size="large" />
        </View>
      )}
      {!isLoading && (isError || !station) && (
        <View style={styles.footer}>
          <MessageInfoBox
            type="error"
            message={t(StationTexts.stationLoadingFailed)}
          />
        </View>
      )}

      {!isLoading && !isLoadingVehicles && !isError && !!station && (
        <View style={styles.vehicleDataContainer}>
          {isErrorVehicles && (
            <MessageInfoBox
              type="error"
              message={t(StationTexts.loadingFailedVehiclesStations)}
            />
          )}
          {station.openingHoursStatus?.isClosed && (
            <MessageInfoBox
              type="info"
              message={t(
                ShmoWarnings.operatorClosed(operatorName, openingTime),
              )}
            />
          )}
          {hasNoAvailableVehicles && (
            <MessageInfoBox
              type="warning"
              message={t(StationTexts.noVehiclesAvailable)}
            />
          )}
          {!!vehicleTypesAvailable?.length && (
            <Section>
              {vehicleTypesAvailable.map((e, index) => {
                const makeModel = [e.vehicleType.make, e.vehicleType.model]
                  .filter(Boolean)
                  .join(' ');
                const vehicleTypeName =
                  makeModel ||
                  t(
                    MobilityTexts.vehicleName(
                      e.vehicleType.formFactor,
                      false,
                      e.vehicleType.propulsionType,
                    ),
                  );
                const availabilityText = t(
                  MobilityTexts.availability(e.count.toString()),
                );

                const image = (
                  <VehicleImage
                    uri={e.vehicleType.vehicleImage}
                    formFactor={e.vehicleType.formFactor}
                    propulsionType={e.vehicleType.propulsionType}
                    size="small"
                  />
                );

                return e.count === 0 ? (
                  <GenericSectionItem
                    key={e.vehicleType.id}
                    accessibility={{
                      accessible: true,
                      accessibilityLabel:
                        vehicleTypeName + screenReaderPause + availabilityText,
                    }}
                  >
                    <View style={styles.vehicleType}>
                      {image}

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
                    key={e.vehicleType.id}
                    text={vehicleTypeName}
                    subtitle={availabilityText}
                    leftElement={image}
                    buttonTextRight={t(dictionary.select)}
                    onPress={() => {
                      const vehicle = vehicleQueries[index]?.data?.[0];
                      if (vehicle?.id) {
                        queryClient.setQueryData(
                          getVehicleQueryKey(vehicle.id),
                          vehicle,
                        );
                        onVehicleTypeSelected(false, vehicle.id);
                      } else {
                        onVehicleTypeSelected(
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
          {isBicycleFormFactor(formFactor) &&
            station.numDocksAvailable != null && (
              <Section>
                <GenericSectionItem style={styles.freeParkingSection}>
                  <ThemeIcon svg={ThemedParkingIcon} size="large" />
                  <ThemeText>
                    {t(
                      MobilityTexts.freeParkingSpaces(
                        station.numDocksAvailable,
                      ),
                    )}
                  </ThemeText>
                </GenericSectionItem>
              </Section>
            )}

          <Section style={styles.supportSection}>
            <SupportButton
              navigateToSupport={() => {
                navigateSupportCallback({
                  operatorId: station.system.operator.id,
                  stationId: station.id,
                  formFactor: formFactor,
                  systemId: station.system.id,
                });
              }}
            />
          </Section>
        </View>
      )}
    </MapBottomSheet>
  );
};

const useSheetStyle = StyleSheet.createThemeHook((theme) => {
  return {
    loading: {
      marginBottom: theme.spacing.medium,
    },
    vehicleDataContainer: {
      marginHorizontal: theme.spacing.medium,
      marginBottom: theme.spacing.medium,
      gap: theme.spacing.small,
    },
    footer: {
      marginBottom: theme.spacing.medium,
      marginHorizontal: theme.spacing.medium,
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
    supportSection: {
      paddingTop: theme.spacing.xSmall,
    },
  };
});
