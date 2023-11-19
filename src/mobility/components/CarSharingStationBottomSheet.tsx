import {ScreenHeaderWithoutNavigation} from '@atb/components/screen-header';
import {ScreenHeaderTexts, useTranslation} from '@atb/translations';
import React from 'react';
import {BottomSheetContainer} from '@atb/components/bottom-sheet';
import {GenericSectionItem, Section} from '@atb/components/sections';
import {OperatorLogo} from '@atb/mobility/components/OperatorLogo';
import {
  CarSharingTexts,
  MobilityTexts,
} from '@atb/translations/screens/subscreens/MobilityTexts';
import {StyleSheet, useTheme} from '@atb/theme';
import {ActivityIndicator, ScrollView, View} from 'react-native';
import {MessageBox} from '@atb/components/message-box';
import {useCarSharingStation} from '@atb/mobility/use-car-sharing-station';
import {ThemeText} from '@atb/components/text';
import {CarAvailabilityFragment} from '@atb/api/types/generated/fragments/stations';
import {CarImage} from '@atb/mobility/components/CarImage';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useOperatorBenefit} from '@atb/mobility/use-operator-benefit';
import {OperatorBenefitActionButton} from '@atb/mobility/components/OperatorBenefitActionButton';
import {OperatorAppSwitchButton} from '@atb/mobility/components/OperatorAppSwitchButton';
import {OperatorBenefit} from '@atb/mobility/components/OperatorBenefit';
import {FormFactor} from '@atb/api/types/generated/mobility-types_v2';
import {ThemeIcon} from '@atb/components/theme-icon';
import {Car} from '@atb/assets/svg/mono-icons/transportation-entur';
import {MobilityDistance} from '@atb/mobility/components/MobilityDistance';

type Props = {
  stationId: string;
  distance: number | undefined;
  close: () => void;
};

export const CarSharingStationSheet = ({stationId, distance, close}: Props) => {
  const {t} = useTranslation();
  const style = useSheetStyle();
  const {theme} = useTheme();

  const {
    station,
    isLoading: isLoadingStation,
    isError: isLoadingError,
    operatorId,
    operatorName,
    brandLogoUrl,
    appStoreUri,
    rentalAppUri,
    stationName,
  } = useCarSharingStation(stationId);
  const {
    operatorBenefit,
    valueCode,
    isUserEligibleForBenefit,
    isLoading: isLoadingBenefit,
    isError: isBenefitError,
  } = useOperatorBenefit(operatorId);

  const isLoading = isLoadingStation || isLoadingBenefit;
  const isError = isLoadingError || isBenefitError;

  const previewCarIconCount = station ? station.capacity : 0;

  function carPreview(
    vehicleTypesAvailable: CarAvailabilityFragment[],
  ): CarAvailabilityFragment[] {
    return vehicleTypesAvailable.slice(previewCarIconCount > 2 ? -1 : -2);
  }

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
          <View style={style.activityIndicator}>
            <ActivityIndicator size="large" />
          </View>
        )}
        {!isLoading && !isError && station && (
          <>
            <ScrollView style={style.container}>
              {operatorBenefit && (
                <OperatorBenefit
                  benefit={operatorBenefit}
                  isUserEligible={isUserEligibleForBenefit}
                  style={style.benefit}
                />
              )}
              <Section>
                <GenericSectionItem>
                  <OperatorLogo
                    operatorName={operatorName}
                    maxHeight={20}
                    maxWidth={20}
                    logoUrl={brandLogoUrl}
                  />
                  <View style={style.stationText}>
                    <ThemeText type="body__secondary" color="secondary">
                      {stationName}
                    </ThemeText>
                    <MobilityDistance distance={distance} />
                  </View>
                </GenericSectionItem>
                <GenericSectionItem>
                  <View style={style.carSection}>
                    <View>
                      <View style={style.availableCarSection}>
                        <ThemeIcon
                          style={style.icon}
                          svg={Car}
                          fill={theme.text.colors.secondary}
                        />
                        <ThemeText
                          type="body__secondary--bold"
                          color="secondary"
                        >
                          {t(
                            CarSharingTexts.stations.carsAvailable(
                              totalAvailableCars(station.vehicleTypesAvailable),
                              station.capacity,
                            ),
                          )}
                        </ThemeText>
                      </View>
                      <ThemeText type="body__secondary" color="secondary">
                        {t(CarSharingTexts.stations.carsAvailableLabel)}
                      </ThemeText>
                    </View>
                    <View style={style.carDetailsContainer}>
                      {station.vehicleTypesAvailable &&
                        carPreview(station.vehicleTypesAvailable).map(
                          (vehicle, i) => (
                            <View
                              key={vehicle.vehicleType.id}
                              style={[
                                style.carImage,
                                i === station.capacity - 1
                                  ? style.carImageLast
                                  : {},
                              ]}
                            >
                              <CarImage
                                uri={vehicle.vehicleType.vehicleImage}
                              />
                            </View>
                          ),
                        )}
                      {station.capacity > 2 && (
                        <CarImage plus={station.capacity-1} />
                      )}
                    </View>
                  </View>
                </GenericSectionItem>
              </Section>
            </ScrollView>
            {rentalAppUri && (
              <View style={style.footer}>
                {operatorBenefit && isUserEligibleForBenefit ? (
                  <OperatorBenefitActionButton
                    benefit={operatorBenefit}
                    valueCode={valueCode}
                    operatorName={operatorName}
                    appStoreUri={appStoreUri}
                    rentalAppUri={rentalAppUri}
                  />
                ) : (
                  <OperatorAppSwitchButton
                    operatorName={operatorName}
                    appStoreUri={appStoreUri}
                    rentalAppUri={rentalAppUri}
                  />
                )}
              </View>
            )}
          </>
        )}
        {!isLoading && (isError || !station) && (
          <View style={style.errorMessage}>
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
    availabilityChip: {
      flex: 1,
      alignItems: 'flex-end',
    },
    availableCarSection: {
      display: 'flex',
      flexDirection: 'row',
    },
    benefit: {
      marginBottom: theme.spacings.medium,
    },
    carDetailsContainer: {
      display: 'flex',
      flexDirection: 'row',
    },
    carSection: {
      display: 'flex',
      flexDirection: 'row',
      flex: 1,
      justifyContent: 'space-between',
    },
    carImage: {
      flexShrink: 1,
      flexGrow: 0,
      marginRight: theme.spacings.xSmall,
    },
    carImageLast: {
      marginRight: 0,
    },
    carDetails: {
      flex: 4,
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
      marginEnd: theme.spacings.xSmall,
    },
    noCarsAvailable: {
      flex: 1,
      alignItems: 'center',
    },
    operatorButton: {
      marginTop: theme.spacings.medium,
    },
    stationText: {
      display: 'flex',
      flexDirection: 'row',
      marginTop: theme.spacings.xSmall,
    },
  };
});

const totalAvailableCars = (
  vehicleTypesAvailable: CarAvailabilityFragment[] | undefined,
): number => {
  return (
    vehicleTypesAvailable
      ?.map((v) => v.count)
      .reduce((sum, count) => sum + count, 0) ?? 0
  );
};
