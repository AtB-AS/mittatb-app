import {ScreenHeaderWithoutNavigation} from '@atb/components/screen-header';
import {ScreenHeaderTexts, useTranslation} from '@atb/translations';
import React from 'react';
import {BottomSheetContainer} from '@atb/components/bottom-sheet';
import {GenericSectionItem, Section} from '@atb/components/sections';
import {OperatorNameAndLogo} from '@atb/mobility/components/OperatorNameAndLogo';
import {
  CarSharingTexts,
  MobilityTexts,
} from '@atb/translations/screens/subscreens/MobilityTexts';
import {StyleSheet} from '@atb/theme';
import {ActivityIndicator, ScrollView, View} from 'react-native';
import {MessageBox} from '@atb/components/message-box';
import {useCarSharingStation} from '@atb/mobility/use-car-sharing-station';
import {ThemeText} from '@atb/components/text';
import {CarAvailabilityFragment} from '@atb/api/types/generated/fragments/stations';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useOperatorBenefit} from '@atb/mobility/use-operator-benefit';
import {OperatorActionButton} from '@atb/mobility/components/OperatorActionButton';
import {OperatorBenefit} from '@atb/mobility/components/OperatorBenefit';
import {FormFactor} from '@atb/api/types/generated/mobility-types_v2';
import {Car} from '@atb/assets/svg/mono-icons/transportation-entur';
import {CarPreviews} from '@atb/mobility/components/CarPreviews';
import {WalkingDistance} from '@atb/components/walking-distance';
import {MobilityStat} from '@atb/mobility/components/MobilityStat';

type Props = {
  stationId: string;
  distance: number | undefined;
  close: () => void;
};

export const CarSharingStationBottomSheet = ({
  stationId,
  distance,
  close,
}: Props) => {
  const {t} = useTranslation();
  const styles = useSheetStyle();

  const {
    station,
    isLoading,
    isError,
    operatorId,
    operatorName,
    brandLogoUrl,
    appStoreUri,
    rentalAppUri,
    stationName,
  } = useCarSharingStation(stationId);
  const {operatorBenefit} = useOperatorBenefit(operatorId);

  return (
    <BottomSheetContainer maxHeightValue={0.5}>
      <ScreenHeaderWithoutNavigation
        leftButton={{
          type: 'close',
          onPress: close,
          text: t(ScreenHeaderTexts.headerButton.close.text),
        }}
        title={t(MobilityTexts.formFactor(FormFactor.Car))}
        color="background_1"
        setFocusOnLoad={false}
      />
      <>
        {isLoading && (
          <View style={styles.activityIndicator}>
            <ActivityIndicator size="large" />
          </View>
        )}
        {!isLoading && !isError && station && (
          <>
            <ScrollView style={styles.container}>
              {operatorBenefit && (
                <OperatorBenefit
                  benefit={operatorBenefit}
                  formFactor={FormFactor.Car}
                  style={styles.operatorBenefit}
                />
              )}
              <Section>
                <GenericSectionItem>
                  <OperatorNameAndLogo
                    operatorName={operatorName}
                    logoUrl={brandLogoUrl}
                    style={styles.operatorNameAndLogo}
                  />
                  <View style={styles.stationText}>
                    <ThemeText type="body__secondary" color="secondary">
                      {stationName}
                    </ThemeText>
                    <WalkingDistance distance={distance} />
                  </View>
                </GenericSectionItem>
                <GenericSectionItem>
                  <View style={styles.carSection}>
                    <MobilityStat
                      svg={Car}
                      primaryStat={t(
                        CarSharingTexts.stations.carsAvailable(
                          totalAvailableCars(station.vehicleTypesAvailable),
                          station.capacity,
                        ),
                      )}
                      secondaryStat={t(
                        CarSharingTexts.stations.carsAvailableLabel,
                      )}
                    />
                    {station.vehicleTypesAvailable && (
                      <CarPreviews
                        stationCapacity={station.capacity}
                        vehicleTypesAvailable={station.vehicleTypesAvailable}
                      />
                    )}
                  </View>
                </GenericSectionItem>
              </Section>
            </ScrollView>
            {rentalAppUri && (
              <View style={styles.footer}>
                <OperatorActionButton
                  operatorId={operatorId}
                  benefit={operatorBenefit}
                  operatorName={operatorName}
                  appStoreUri={appStoreUri}
                  rentalAppUri={rentalAppUri}
                />
              </View>
            )}
          </>
        )}
        {!isLoading && (isError || !station) && (
          <View style={styles.errorMessage}>
            <MessageBox
              type="error"
              message={t(CarSharingTexts.loadingFailed)}
              onPressConfig={{
                action: close,
                text: t(ScreenHeaderTexts.headerButton.close.text),
              }}
            />
          </View>
        )}
      </>
    </BottomSheetContainer>
  );
};

const useSheetStyle = StyleSheet.createThemeHook((theme) => {
  const {bottom} = useSafeAreaInsets();
  return {
    activityIndicator: {
      marginBottom: Math.max(bottom, theme.spacings.medium),
    },
    operatorBenefit: {
      marginBottom: theme.spacings.medium,
    },
    carSection: {
      display: 'flex',
      flexDirection: 'row',
      flex: 1,
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    container: {
      marginHorizontal: theme.spacings.medium,
      marginBottom: theme.spacings.medium,
    },
    errorMessage: {
      marginHorizontal: theme.spacings.medium,
    },
    footer: {
      marginBottom: Math.max(bottom, theme.spacings.medium),
      marginHorizontal: theme.spacings.medium,
    },
    icon: {
      marginEnd: theme.spacings.small,
    },
    operatorNameAndLogo: {
      flexDirection: 'row',
    },
    stationText: {
      display: 'flex',
      flexDirection: 'row',
      marginTop: theme.spacings.small,
    },
  };
});

const totalAvailableCars = (
  vehicleTypesAvailable: CarAvailabilityFragment[] | undefined,
) =>
  vehicleTypesAvailable
    ?.map((v) => v.count)
    .reduce((sum, count) => sum + count, 0) ?? 0;
