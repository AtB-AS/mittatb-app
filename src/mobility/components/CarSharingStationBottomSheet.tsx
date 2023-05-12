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
import {useSystem} from '@atb/mobility/use-system';
import {FullScreenFooter} from '@atb/components/screen-footer';
import {Button} from '@atb/components/button';
import {
  CarSharingTexts,
  MobilityTexts,
} from '@atb/translations/screens/subscreens/MobilityTexts';
import {getRentalAppUri} from '@atb/mobility/utils';
import {StyleSheet} from '@atb/theme';
import {useOperatorApp} from '@atb/mobility/use-operator-app';
import {ActivityIndicator, ScrollView, View} from 'react-native';
import {useTextForLanguage} from '@atb/translations/utils';
import {MessageBox} from '@atb/components/message-box';
import {useCarSharingStation} from '@atb/mobility/use-car-sharing-station';
import {WalkingDistance} from '@atb/components/walking-distance';
import {CarName} from '@atb/mobility/components/CarName';
import {ThemeText} from '@atb/components/text';
import {CarAvailabilityFragment} from '@atb/api/types/generated/fragments/stations';
import {CarImage} from '@atb/mobility/components/CarImage';

type Props = {
  stationId: string;
  distance: number | undefined;
  close: () => void;
};

export const CarSharingStationSheet = ({stationId, distance, close}: Props) => {
  const {t, language} = useTranslation();
  const style = useSheetStyle();
  const {station, isLoading, error} = useCarSharingStation(stationId);
  const {appStoreUri, brandLogoUrl, operatorName} = useSystem(station);
  const rentalAppUri = getRentalAppUri(station);
  const {openOperatorApp} = useOperatorApp({
    operatorName,
    appStoreUri,
    rentalAppUri,
  });
  const stationName = useTextForLanguage(station?.name.translation) ?? '';

  return (
    <BottomSheetContainer maxHeightValue={0.5}>
      <ScreenHeaderWithoutNavigation
        leftButton={{
          type: 'close',
          onPress: close,
          text: t(ScreenHeaderTexts.headerButton.close.text),
        }}
        title={stationName}
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
            <WalkingDistance distance={distance} />
            <ScrollView style={style.container}>
              <Section>
                <GenericSectionItem>
                  <OperatorLogo
                    operatorName={operatorName}
                    logoUrl={brandLogoUrl}
                  />
                </GenericSectionItem>
              </Section>

              {station.vehicleTypesAvailable
                ?.sort(byName(language))
                .map((vehicle, i) => (
                  <Section key={'vehicle' + i} withTopPadding>
                    <GenericSectionItem>
                      <View style={style.carDetailsContainer}>
                        <View style={style.carImage}>
                          <CarImage uri={vehicle.vehicleType.vehicleImage} />
                        </View>
                        <View style={style.carDetails}>
                          <CarName vehicleType={vehicle.vehicleType} />
                          <ThemeText type={'body__secondary'}>
                            {t(
                              CarSharingTexts.propultionType(
                                vehicle.vehicleType.propulsionType,
                              ),
                            )}
                          </ThemeText>
                        </View>
                      </View>
                    </GenericSectionItem>
                  </Section>
                ))}
            </ScrollView>
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
  carDetailsContainer: {
    display: 'flex',
    flex: 1,
    flexDirection: 'row',
  },
  carImage: {
    flexShrink: 1,
    flexGrow: 0,
    marginRight: theme.spacings.medium,
  },
  carDetails: {
    flexGrow: 0,
    flexShrink: 4,
  },
  container: {
    paddingHorizontal: theme.spacings.medium,
    marginBottom: theme.spacings.medium,
  },
  errorMessage: {
    marginHorizontal: theme.spacings.medium,
  },
}));

const byName =
  (language: Language) =>
  (a: CarAvailabilityFragment, b: CarAvailabilityFragment) =>
    (
      getTextForLanguage(a.vehicleType.name?.translation, language) ?? ''
    ).localeCompare(
      getTextForLanguage(b.vehicleType.name?.translation, language) ?? '',
    ) ?? 0;
