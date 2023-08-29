import {ScreenHeaderWithoutNavigation} from '@atb/components/screen-header';
import {ScreenHeaderTexts, useTranslation} from '@atb/translations';
import React from 'react';
import {BottomSheetContainer} from '@atb/components/bottom-sheet';
import {GenericSectionItem, Section} from '@atb/components/sections';
import {OperatorLogo} from '@atb/mobility/components/OperatorLogo';
import {useSystem} from '@atb/mobility/use-system';
import {
  BicycleTexts,
  MobilityTexts,
} from '@atb/translations/screens/subscreens/MobilityTexts';
import {
  getAvailableVehicles,
  getRentalAppUri,
  isUserEligibleForBenefit,
} from '@atb/mobility/utils';
import {StyleSheet, useTheme} from '@atb/theme';
import {VehicleStat} from '@atb/mobility/components/VehicleStat';
import {Bicycle} from '@atb/assets/svg/mono-icons/vehicles';
import {Parking as ParkingDark} from '@atb/assets/svg/color/icons/vehicles/dark';
import {Parking as ParkingLight} from '@atb/assets/svg/color/icons/vehicles/light';
import {VehicleStats} from '@atb/mobility/components/VehicleStats';
import {ActivityIndicator, ScrollView, View} from 'react-native';
import {useTextForLanguage} from '@atb/translations/utils';
import {useBikeStation} from '@atb/mobility/use-bike-station';
import {MessageBox} from '@atb/components/message-box';
import {FormFactor} from '@atb/api/types/generated/mobility-types_v2';
import {WalkingDistance} from '@atb/components/walking-distance';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {OperatorBenefit} from '@atb/mobility/components/OperatorBenefit';
import {Button} from '@atb/components/button';
import {useOperatorApp} from '@atb/mobility/use-operator-app';
import {useBenefits} from '@atb/mobility/use-benefits';

type Props = {
  stationId: string;
  distance: number | undefined;
  close: () => void;
};

export const BikeStationSheet = ({stationId, distance, close}: Props) => {
  const {t} = useTranslation();
  const {themeName} = useTheme();
  const style = useSheetStyle();
  const {
    station,
    isLoading: isLoadingStation,
    error: stationError,
  } = useBikeStation(stationId);
  const {appStoreUri, brandLogoUrl, operatorId, operatorName} =
    useSystem(station);
  const rentalAppUri = getRentalAppUri(station);
  const stationName = useTextForLanguage(station?.name.translation);
  const availableBikes = getAvailableVehicles(
    station?.vehicleTypesAvailable,
    FormFactor.Bicycle,
  );
  const {openOperatorApp} = useOperatorApp({
    operatorName,
    appStoreUri,
    rentalAppUri,
  });
  const {
    userBenefits,
    operatorBenefits,
    doBenefitAction,
    loading: isLoadingBenefits,
    error: benefitsError,
  } = useBenefits(operatorId);

  const isLoading = isLoadingStation || isLoadingBenefits;
  const isError = !!stationError || !!benefitsError;

  // The data model handles multiple benefits per operator,
  // but we currently know there is only one,
  // and the UI has to change anyway to support an undetermined number of benefits.
  const operatorBenefit =
    operatorBenefits && operatorBenefits.length > 0
      ? operatorBenefits[0]
      : undefined;

  return (
    <BottomSheetContainer maxHeightValue={0.5}>
      <ScreenHeaderWithoutNavigation
        leftButton={{
          type: 'close',
          onPress: close,
          text: t(ScreenHeaderTexts.headerButton.close.text),
        }}
        title={stationName ?? ''}
        color={'background_1'}
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
            <WalkingDistance
              style={style.walkingDistance}
              distance={distance}
            />
            <ScrollView style={style.container}>
              <Section>
                <GenericSectionItem>
                  <OperatorLogo
                    operatorName={operatorName}
                    logoUrl={brandLogoUrl}
                  />
                </GenericSectionItem>
              </Section>
              <VehicleStats
                left={
                  <VehicleStat
                    svg={Bicycle}
                    primaryStat={availableBikes}
                    secondaryStat={t(BicycleTexts.stations.numBikesAvailable)}
                  />
                }
                right={
                  <VehicleStat
                    svg={themeName === 'dark' ? ParkingDark : ParkingLight}
                    primaryStat={
                      station.numDocksAvailable ??
                      t(BicycleTexts.stations.unknownDocksAvailable)
                    }
                    secondaryStat={t(BicycleTexts.stations.numDocksAvailable)}
                  />
                }
              />

              {operatorBenefit && (
                <OperatorBenefit
                  benefit={operatorBenefit}
                  isUserEligible={isUserEligibleForBenefit(
                    operatorBenefit.id,
                    userBenefits,
                  )}
                  style={style.benefit}
                />
              )}
            </ScrollView>
            {rentalAppUri && (
              <View style={style.footer}>
                <Button
                  text={t(MobilityTexts.operatorAppSwitchButton(operatorName))}
                  onPress={() =>
                    operatorBenefit &&
                    isUserEligibleForBenefit(operatorBenefit.id, userBenefits)
                      ? doBenefitAction(operatorBenefit)
                      : openOperatorApp()
                  }
                  mode="primary"
                  interactiveColor={'interactive_0'}
                />
              </View>
            )}
          </>
        )}
        {!isLoading && (isError || !station) && (
          <View style={style.errorMessage}>
            <MessageBox
              type="error"
              message={t(BicycleTexts.loadingFailed)}
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
    benefit: {
      marginBottom: theme.spacings.medium,
    },
    container: {
      paddingHorizontal: theme.spacings.medium,
    },
    stationName: {
      flex: 1,
      alignItems: 'center',
    },
    errorMessage: {
      marginHorizontal: theme.spacings.medium,
    },
    footer: {
      marginBottom: Math.max(bottom, theme.spacings.medium),
      marginHorizontal: theme.spacings.medium,
    },
    walkingDistance: {
      marginBottom: theme.spacings.medium,
    },
  };
});
