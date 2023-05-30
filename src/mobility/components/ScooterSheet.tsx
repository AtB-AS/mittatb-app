import {VehicleId} from '@atb/api/types/generated/fragments/vehicles';
import React, {useEffect} from 'react';
import {BottomSheetContainer} from '@atb/components/bottom-sheet';
import {ScreenHeaderWithoutNavigation} from '@atb/components/screen-header';
import {
  getTextForLanguage,
  Language,
  ScreenHeaderTexts,
  useTranslation,
} from '@atb/translations';
import {StyleSheet} from '@atb/theme';
import {Battery} from '@atb/assets/svg/mono-icons/vehicles';
import {Button} from '@atb/components/button';
import {
  MobilityTexts,
  ScooterTexts,
} from '@atb/translations/screens/subscreens/MobilityTexts';
import {VehicleStat} from '@atb/mobility/components/VehicleStat';
import {GenericSectionItem, Section} from '@atb/components/sections';
import {formatDecimalNumber} from '@atb/utils/numbers';
import {PricingPlan} from '@atb/mobility/components/PricingPlan';
import {OperatorLogo} from '@atb/mobility/components/OperatorLogo';
import {getRentalAppUri} from '@atb/mobility/utils';
import {useSystem} from '@atb/mobility/use-system';
import {useOperatorApp} from '@atb/mobility/use-operator-app';
import {VehicleStats} from '@atb/mobility/components/VehicleStats';
import {useVehicle} from '@atb/mobility/use-vehicle';
import {ActivityIndicator, ScrollView, View} from 'react-native';
import {MessageBox} from '@atb/components/message-box';
import {useAnalytics} from '@atb/analytics';
import {useSafeAreaInsets} from 'react-native-safe-area-context';

type Props = {
  vehicleId: VehicleId;
  close: () => void;
};
export const ScooterSheet = ({vehicleId: id, close}: Props) => {
  const {t, language} = useTranslation();
  const style = useSheetStyle();
  const {vehicle, isLoading, error} = useVehicle(id);
  const {appStoreUri, brandLogoUrl, operatorName} = useSystem(
    vehicle,
    vehicle?.system.operator.name,
  );
  const rentalAppUri = getRentalAppUri(vehicle);
  const {openOperatorApp} = useOperatorApp({
    operatorName,
    appStoreUri,
    rentalAppUri,
  });
  const analytics = useAnalytics();

  useEffect(() => {
    analytics.logEvent('Mobility', 'Scooter selected', {
      id: vehicle?.id,
      operator: getTextForLanguage(
        vehicle?.system?.operator?.name.translation,
        language,
      ),
    });
  }, [vehicle]);

  return (
    <BottomSheetContainer maxHeightValue={0.5}>
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
        {!isLoading && !error && vehicle && (
          <>
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
                    svg={Battery}
                    primaryStat={vehicle.currentFuelPercent + '%'}
                    secondaryStat={getRange(
                      vehicle.currentRangeMeters,
                      language,
                    )}
                  />
                }
                right={
                  <PricingPlan
                    operator={operatorName}
                    plan={vehicle.pricingPlan}
                  />
                }
              />
            </ScrollView>
            {rentalAppUri && (
              <View style={style.footer}>
                <Button
                  text={t(MobilityTexts.operatorAppSwitchButton(operatorName))}
                  onPress={openOperatorApp}
                  mode="primary"
                  interactiveColor={'interactive_0'}
                />
              </View>
            )}
          </>
        )}
        {!isLoading && (error || !vehicle) && (
          <View style={style.errorMessage}>
            <MessageBox
              type="error"
              message={t(ScooterTexts.loadingFailed)}
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

const getRange = (rangeInMeters: number, language: Language) => {
  const rangeInKm =
    rangeInMeters > 5000
      ? (rangeInMeters / 1000).toFixed(0)
      : formatDecimalNumber(rangeInMeters / 1000, language, 1);
  return `ca. ${rangeInKm} km`;
};

const useSheetStyle = StyleSheet.createThemeHook((theme) => {
  const {bottom} = useSafeAreaInsets();
  return {
    activityIndicator: {
      marginBottom: Math.max(bottom, theme.spacings.medium),
    },
    container: {
      paddingHorizontal: theme.spacings.medium,
    },
    errorMessage: {
      marginHorizontal: theme.spacings.medium,
    },
    footer: {
      marginBottom: Math.max(bottom, theme.spacings.medium),
      marginHorizontal: theme.spacings.medium,
    },
  };
});
