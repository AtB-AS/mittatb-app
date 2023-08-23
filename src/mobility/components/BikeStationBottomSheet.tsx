import {ScreenHeaderWithoutNavigation} from '@atb/components/screen-header';
import {ScreenHeaderTexts, useTranslation} from '@atb/translations';
import React from 'react';
import {BottomSheetContainer} from '@atb/components/bottom-sheet';
import {GenericSectionItem, Section} from '@atb/components/sections';
import {OperatorLogo} from '@atb/mobility/components/OperatorLogo';
import {useSystem} from '@atb/mobility/use-system';
import {BicycleTexts} from '@atb/translations/screens/subscreens/MobilityTexts';
import {getAvailableVehicles, getRentalAppUri} from '@atb/mobility/utils';
import {StyleSheet, useTheme} from '@atb/theme';
import {VehicleStat} from '@atb/mobility/components/VehicleStat';
import {Bicycle} from '@atb/assets/svg/mono-icons/vehicles';
import {Parking as ParkingDark} from '@atb/assets/svg/color/icons/vehicles/dark';
import {Parking as ParkingLight} from '@atb/assets/svg/color/icons/vehicles/light';
import {VehicleStats} from '@atb/mobility/components/VehicleStats';
import {ActivityIndicator, View} from 'react-native';
import {useTextForLanguage} from '@atb/translations/utils';
import {useBikeStation} from '@atb/mobility/use-bike-station';
import {MessageBox} from '@atb/components/message-box';
import {FormFactor} from '@atb/api/types/generated/mobility-types_v2';
import {WalkingDistance} from '@atb/components/walking-distance';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {OperatorBenefits} from '@atb/mobility/components/OperatorBenefits';
import {useUserBenefits} from '@atb/mobility/use-user-benefits';
import {CallToActionButton} from '@atb/mobility/components/CallToActionButton';

type Props = {
  stationId: string;
  distance: number | undefined;
  close: () => void;
};

export const BikeStationSheet = ({stationId, distance, close}: Props) => {
  const {t} = useTranslation();
  const {themeName} = useTheme();
  const style = useSheetStyle();
  const {station, isLoading, error} = useBikeStation(stationId);
  const {appStoreUri, brandLogoUrl, operatorId, operatorName} =
    useSystem(station);
  const rentalAppUri = getRentalAppUri(station);
  const stationName = useTextForLanguage(station?.name.translation);
  const availableBikes = getAvailableVehicles(
    station?.vehicleTypesAvailable,
    FormFactor.Bicycle,
  );
  const userBenefits = useUserBenefits(operatorId);

  return (
    <BottomSheetContainer>
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
        {!isLoading && !error && station && (
          <>
            <WalkingDistance
              style={style.walkingDistance}
              distance={distance}
            />
            <View style={style.container}>
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
              <OperatorBenefits
                operatorId={operatorId}
                userBenefits={userBenefits}
                style={style.benefits}
              />
            </View>
            {rentalAppUri && (
              <View style={style.footer}>
                <CallToActionButton
                  appStoreUri={appStoreUri}
                  operatorId={operatorId}
                  operatorName={operatorName}
                  rentalAppUri={rentalAppUri}
                  userBenefits={userBenefits}
                />
              </View>
            )}
          </>
        )}
        {!isLoading && (error || !station) && (
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
    benefits: {
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
