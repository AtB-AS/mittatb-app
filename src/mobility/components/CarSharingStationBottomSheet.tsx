import {ScreenHeaderWithoutNavigation} from '@atb/components/screen-header';
import {ScreenHeaderTexts, useTranslation} from '@atb/translations';
import React from 'react';
import {BottomSheetContainer} from '@atb/components/bottom-sheet';
import {GenericSectionItem, Section} from '@atb/components/sections';
import {OperatorLogo} from '@atb/mobility/components/OperatorLogo';
import {useSystem} from '@atb/mobility/use-system';
import {FullScreenFooter} from '@atb/components/screen-footer';
import {Button} from '@atb/components/button';
import {
  CarSharingTexts,
  MobilityTexts,
} from '@atb/translations/screens/subscreens/MobilityTexts';
import {getAvailableVehicles, getRentalAppUri} from '@atb/mobility/utils';
import {StyleSheet} from '@atb/theme';
import {useOperatorApp} from '@atb/mobility/use-operator-app';
import {ThemeText} from '@atb/components/text';
import {ActivityIndicator, View} from 'react-native';
import {useTextForLanguage} from '@atb/translations/utils';
import {MessageBox} from '@atb/components/message-box';
import {useCarSharingStation} from '@atb/mobility/use-car-sharing-station';
import {VehicleStat} from '@atb/mobility/components/VehicleStat';
import {Bicycle} from '@atb/assets/svg/mono-icons/vehicles';
import {VehicleStats} from '@atb/mobility/components/VehicleStats';
import {FormFactor} from '@atb/api/types/generated/mobility-types_v2';
import {Unknown} from '@atb/assets/svg/mono-icons/status';

type Props = {
  stationId: string;
  close: () => void;
};

export const CarSharingStationSheet = ({stationId, close}: Props) => {
  const {t} = useTranslation();
  const style = useSheetStyle();
  const {station, isLoading, error} = useCarSharingStation(stationId);
  const {appStoreUri, brandLogoUrl, operatorName} = useSystem(station);
  const rentalAppUri = getRentalAppUri(station);
  const {openOperatorApp} = useOperatorApp({
    operatorName,
    appStoreUri,
    rentalAppUri,
  });
  const stationName = useTextForLanguage(station?.name.translation);

  return (
    <BottomSheetContainer>
      <ScreenHeaderWithoutNavigation
        leftButton={{
          type: 'close',
          onPress: close,
          text: t(ScreenHeaderTexts.headerButton.close.text),
        }}
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
            <View style={style.container}>
              <Section>
                <GenericSectionItem>
                  <OperatorLogo
                    operatorName={operatorName}
                    logoUrl={brandLogoUrl}
                  />
                  {stationName && (
                    <View style={style.stationName}>
                      <ThemeText type="body__secondary">
                        {stationName}
                      </ThemeText>
                    </View>
                  )}
                </GenericSectionItem>
              </Section>
              <VehicleStats
                left={
                  <VehicleStat
                    svg={Bicycle}
                    primaryStat={getAvailableVehicles(
                      station.vehicleTypesAvailable,
                      FormFactor.Car,
                    )}
                    secondaryStat={t(CarSharingTexts.stations.numCarsAvailable)}
                  />
                }
                right={
                  <VehicleStat
                    svg={Unknown}
                    primaryStat={'Ingen'}
                    secondaryStat={'ting her enda'}
                  />
                }
              />
            </View>
            {rentalAppUri && (
              <FullScreenFooter>
                <Button
                  text={t(MobilityTexts.operatorAppSwitchButton(operatorName))}
                  onPress={openOperatorApp}
                  mode="primary"
                  interactiveColor={'interactive_0'}
                />
              </FullScreenFooter>
            )}
          </>
        )}
        {!isLoading && (error || !station) && (
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

const useSheetStyle = StyleSheet.createThemeHook((theme) => ({
  activityIndicator: {
    marginBottom: theme.spacings.xLarge,
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
}));
