import {ScreenHeaderWithoutNavigation} from '@atb/components/screen-header';
import {ScreenHeaderTexts, useTranslation} from '@atb/translations';
import React from 'react';
import {BottomSheetContainer} from '@atb/components/bottom-sheet';
import {GenericSectionItem, Section} from '@atb/components/sections';
import {OperatorLogo} from '@atb/mobility/components/OperatorLogo';
import {
  BicycleTexts,
  MobilityTexts,
} from '@atb/translations/screens/subscreens/MobilityTexts';
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
import {Button} from '@atb/components/button';
import {useOperatorApp} from '@atb/mobility/use-operator-app';
import {OperatorBenefits} from '@atb/mobility/components/OperatorBenefits';

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
    error,
    station,
    brandLogoUrl,
    stationName,
    operatorName,
    appStoreUri,
    rentalAppUri,
    availableBikes,
  } = useBikeStation(stationId);

  const {openOperatorApp} = useOperatorApp();

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
        {!isLoading && !error && station && (
          <>
            <WalkingDistance
              style={style.walkingDistance}
              distance={distance}
            />
            <ScrollView style={style.container}>
              <OperatorBenefits entity={station} style={style.benefit} />
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
                <Button
                  text={t(MobilityTexts.operatorAppSwitchButton(operatorName))}
                  onPress={() =>
                    openOperatorApp({operatorName, appStoreUri, rentalAppUri})
                  }
                  mode="primary"
                  interactiveColor="interactive_0"
                />
              </View>
            )}
          </>
        )}
        {!isLoading && (!!error || !station) && (
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
