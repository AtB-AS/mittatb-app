import {ScreenHeaderWithoutNavigation} from '@atb/components/screen-header';
import {ScreenHeaderTexts, useTranslation} from '@atb/translations';
import React from 'react';
import {BottomSheetContainer} from '@atb/components/bottom-sheet';
import {GenericSectionItem, Section} from '@atb/components/sections';
import {OperatorLogo} from '@atb/mobility/components/OperatorLogo';
import {BicycleTexts} from '@atb/translations/screens/subscreens/MobilityTexts';
import {StyleSheet, useTheme} from '@atb/theme';
import {VehicleStat} from '@atb/mobility/components/VehicleStat';
import {Bicycle} from '@atb/assets/svg/mono-icons/vehicles';
import {Parking as ParkingDark} from '@atb/assets/svg/color/icons/vehicles/dark';
import {Parking as ParkingLight} from '@atb/assets/svg/color/icons/vehicles/light';
import {VehicleStats} from '@atb/mobility/components/VehicleStats';
import {ActivityIndicator, ScrollView, View} from 'react-native';
import {useBikeStation} from '@atb/mobility/use-bike-station';
import {MessageBox} from '@atb/components/message-box';
import {WalkingDistance} from '@atb/components/walking-distance';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useOperatorBenefit} from '@atb/mobility/use-operator-benefit';
import {OperatorBenefit} from '@atb/mobility/components/OperatorBenefit';
import {OperatorActionButton} from './OperatorActionButton';

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
    isLoading,
    isError,
    station,
    brandLogoUrl,
    stationName,
    operatorId,
    operatorName,
    appStoreUri,
    rentalAppUri,
    availableBikes,
  } = useBikeStation(stationId);
  const {operatorBenefit} = useOperatorBenefit(operatorId);

  return (
    <BottomSheetContainer maxHeightValue={0.5}>
      <ScreenHeaderWithoutNavigation
        leftButton={{
          type: 'close',
          onPress: close,
          text: t(ScreenHeaderTexts.headerButton.close.text),
        }}
        title={stationName ?? ''}
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
            <WalkingDistance
              style={style.walkingDistance}
              distance={distance}
            />
            <ScrollView style={style.container}>
              {operatorBenefit && (
                <OperatorBenefit
                  style={style.operatorBenefit}
                  benefit={operatorBenefit}
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
            </ScrollView>
            {rentalAppUri && (
              <View style={style.footer}>
                <OperatorActionButton
                  operatorId={operatorId}
                  operatorName={operatorName}
                  benefit={operatorBenefit}
                  appStoreUri={appStoreUri}
                  rentalAppUri={rentalAppUri}
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
    operatorBenefit: {
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
