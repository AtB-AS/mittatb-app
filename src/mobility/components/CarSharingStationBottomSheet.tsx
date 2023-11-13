import {ScreenHeaderWithoutNavigation} from '@atb/components/screen-header';
import {
  getTextForLanguage,
  Language,
  ScreenHeaderTexts,
  useTranslation,
} from '@atb/translations';
import React from 'react';
import {BottomSheetContainer} from '@atb/components/bottom-sheet';
import {GenericSectionItem, Section} from '@atb/components/sections';
import {OperatorLogo} from '@atb/mobility/components/OperatorLogo';
import {CarSharingTexts} from '@atb/translations/screens/subscreens/MobilityTexts';
import {StyleSheet} from '@atb/theme';
import {ActivityIndicator, ScrollView, View} from 'react-native';
import {MessageBox} from '@atb/components/message-box';
import {useCarSharingStation} from '@atb/mobility/use-car-sharing-station';
import {WalkingDistance} from '@atb/components/walking-distance';
import {CarName} from '@atb/mobility/components/CarName';
import {ThemeText} from '@atb/components/text';
import {CarAvailabilityFragment} from '@atb/api/types/generated/fragments/stations';
import {CarImage} from '@atb/mobility/components/CarImage';
import {InfoChip} from '@atb/components/info-chip';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useOperatorBenefit} from '@atb/mobility/use-operator-benefit';
import {OperatorBenefitActionButton} from '@atb/mobility/components/OperatorBenefitActionButton';
import {OperatorAppSwitchButton} from '@atb/mobility/components/OperatorAppSwitchButton';
import {OperatorBenefit} from '@atb/mobility/components/OperatorBenefit';

type Props = {
  stationId: string;
  distance: number | undefined;
  close: () => void;
};

export const CarSharingStationSheet = ({stationId, distance, close}: Props) => {
  const {t, language} = useTranslation();
  const style = useSheetStyle();
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

  return (
    <BottomSheetContainer maxHeightValue={0.5}>
      <ScreenHeaderWithoutNavigation
        leftButton={{
          type: 'close',
          onPress: close,
          text: t(ScreenHeaderTexts.headerButton.close.text),
        }}
        title={stationName}
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
              <WalkingDistance
                style={style.walkingDistance}
                distance={distance}
              />
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
                    logoUrl={brandLogoUrl}
                  />
                </GenericSectionItem>
              </Section>
              {isAnyAvailable(station.vehicleTypesAvailable) &&
                station.vehicleTypesAvailable
                  ?.filter(isAvailable)
                  .sort(byName(language))
                  .map((vehicle, i) => (
                    <Section key={'vehicle' + i} style={style.carSection}>
                      <GenericSectionItem>
                        <View style={style.carDetailsContainer}>
                          <View style={style.carImage}>
                            <CarImage uri={vehicle.vehicleType.vehicleImage} />
                          </View>
                          <View style={style.carDetails}>
                            <CarName vehicleType={vehicle.vehicleType} />
                            <ThemeText type="body__secondary">
                              {t(
                                CarSharingTexts.propultionType(
                                  vehicle.vehicleType.propulsionType,
                                ),
                              )}
                            </ThemeText>
                            <View style={style.availabilityChip}>
                              <InfoChip
                                text={t(
                                  CarSharingTexts.stations.carsAvailable(
                                    vehicle.count,
                                  ),
                                )}
                                interactiveColor="interactive_0"
                              />
                            </View>
                          </View>
                        </View>
                      </GenericSectionItem>
                    </Section>
                  ))}
              {!isAnyAvailable(station.vehicleTypesAvailable) && (
                <Section withTopPadding withBottomPadding>
                  <View style={style.noCarsAvailable}>
                    <ThemeText type="body__secondary">
                      {t(CarSharingTexts.stations.noCarsAvailable)}
                    </ThemeText>
                  </View>
                </Section>
              )}
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
    benefit: {
      marginBottom: theme.spacings.medium,
    },
    carDetailsContainer: {
      display: 'flex',
      flex: 1,
      flexDirection: 'row',
    },
    carSection: {
      marginTop: theme.spacings.medium,
    },
    carImage: {
      flexShrink: 1,
      flexGrow: 0,
      marginRight: theme.spacings.medium,
    },
    carDetails: {
      flex: 4,
    },
    container: {
      marginHorizontal: theme.spacings.medium,
      //marginBottom: theme.spacings.medium,
    },
    errorMessage: {
      marginHorizontal: theme.spacings.medium,
    },
    footer: {
      marginBottom: Math.max(bottom, theme.spacings.medium),
      marginHorizontal: theme.spacings.medium,
    },
    noCarsAvailable: {
      flex: 1,
      alignItems: 'center',
    },
    operatorButton: {
      marginTop: theme.spacings.medium,
    },
    walkingDistance: {
      marginBottom: theme.spacings.medium,
    },
  };
});

const isAnyAvailable = (
  vehicleTypesAvailable: CarAvailabilityFragment[] | undefined,
) => {
  const count =
    vehicleTypesAvailable
      ?.map((v) => v.count)
      .reduce((sum, count) => sum + count, 0) ?? 0;
  return count > 0;
};

const byName =
  (language: Language) =>
  (a: CarAvailabilityFragment, b: CarAvailabilityFragment) =>
    (
      getTextForLanguage(a.vehicleType.name?.translation, language) ?? ''
    ).localeCompare(
      getTextForLanguage(b.vehicleType.name?.translation, language) ?? '',
    ) ?? 0;

const isAvailable = (c: CarAvailabilityFragment) => c.count > 0;
