import {ScreenHeaderWithoutNavigation} from '@atb/components/screen-header';
import {ScreenHeaderTexts, useTranslation} from '@atb/translations';
import React from 'react';
import {BottomSheetContainer} from '@atb/components/bottom-sheet';
import {GenericSectionItem, Section} from '@atb/components/sections';
import {OperatorNameAndLogo} from '@atb/mobility/components/OperatorNameAndLogo';
import {
  BicycleTexts,
  MobilityTexts,
} from '@atb/translations/screens/subscreens/MobilityTexts';
import {StyleSheet} from '@atb/theme';
import {ActivityIndicator, ScrollView, View} from 'react-native';
import {useBikeStation} from '@atb/mobility/use-bike-station';
import {MessageBox} from '@atb/components/message-box';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useOperatorBenefit} from '@atb/mobility/use-operator-benefit';
import {OperatorBenefit} from '@atb/mobility/components/OperatorBenefit';
import {OperatorAppSwitchButton} from '@atb/mobility/components/OperatorAppSwitchButton';
import {OperatorBenefitActionButton} from '@atb/mobility/components/OperatorBenefitActionButton';
import {FormFactor} from '@atb/api/types/generated/mobility-types_v2';
import {ThemeText} from '@atb/components/text';
import {Bicycle} from '@atb/assets/svg/mono-icons/transportation-entur';
import {CityBike} from '@atb/assets/svg/color/images/mobility';
import {MobilityStats} from '@atb/mobility/components/MobilityStats';
import {MobilityStat} from '@atb/mobility/components/MobilityStat';
import {Parking} from '@atb/assets/svg/mono-icons/places';
import {WalkingDistance} from '@atb/components/walking-distance';
import {BrandingImage} from './BrandingImage';

type Props = {
  stationId: string;
  distance: number | undefined;
  close: () => void;
};

export const BikeStationBottomSheet = ({stationId, distance, close}: Props) => {
  const {t} = useTranslation();
  const styles = useSheetStyle();
  const {
    isLoading: isLoadingStation,
    isError: isLoadingError,
    station,
    brandLogoUrl,
    stationName,
    operatorId,
    operatorName,
    appStoreUri,
    rentalAppUri,
    availableBikes,
  } = useBikeStation(stationId);
  const {
    operatorBenefit,
    valueCode,
    isLoading: isLoadingBenefits,
    isError: isBenefitError,
    isUserEligibleForBenefit,
  } = useOperatorBenefit(operatorId);

  const isLoading = isLoadingStation || isLoadingBenefits;
  const isError = isLoadingError || isBenefitError;

  return (
    <BottomSheetContainer maxHeightValue={0.6}>
      <ScreenHeaderWithoutNavigation
        leftButton={{
          type: 'close',
          onPress: close,
          text: t(ScreenHeaderTexts.headerButton.close.text),
        }}
        title={t(MobilityTexts.formFactor(FormFactor.Bicycle))}
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
                  isUserEligible={isUserEligibleForBenefit}
                  formFactor={FormFactor.Bicycle}
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
                  <View style={styles.mobilityStatContainer}>
                    <MobilityStats
                      first={
                        <MobilityStat
                          svg={Bicycle}
                          primaryStat={availableBikes}
                          secondaryStat={t(
                            BicycleTexts.stations.numBikesAvailable,
                          )}
                        />
                      }
                      second={
                        <MobilityStat
                          svg={Parking}
                          primaryStat={
                            station.numDocksAvailable ??
                            t(BicycleTexts.stations.unknownDocksAvailable)
                          }
                          secondaryStat={t(
                            BicycleTexts.stations.numDocksAvailable,
                          )}
                        />
                      }
                    />
                    <BrandingImage
                      logoUrl={brandLogoUrl}
                      fallback={<CityBike />}
                    />
                  </View>
                </GenericSectionItem>
              </Section>
            </ScrollView>
            {rentalAppUri && (
              <View style={styles.footer}>
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
          <View style={styles.errorMessage}>
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
      marginHorizontal: theme.spacings.medium,
      marginBottom: theme.spacings.medium,
    },
    stationName: {
      flex: 1,
      alignItems: 'center',
    },
    stationText: {
      display: 'flex',
      flexDirection: 'row',
      marginTop: theme.spacings.small,
    },
    errorMessage: {
      marginHorizontal: theme.spacings.medium,
    },
    footer: {
      marginBottom: Math.max(bottom, theme.spacings.medium),
      marginHorizontal: theme.spacings.medium,
    },
    mobilityStatContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    operatorNameAndLogo: {
      flexDirection: 'row',
    },
  };
});
