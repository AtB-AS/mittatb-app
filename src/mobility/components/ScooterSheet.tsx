import {VehicleId} from '@atb/api/types/generated/fragments/vehicles';
import React from 'react';
import {BottomSheetContainer} from '@atb/components/bottom-sheet';
import {ScreenHeaderWithoutNavigation} from '@atb/components/screen-header';
import {Language, ScreenHeaderTexts, useTranslation} from '@atb/translations';
import {StyleSheet} from '@atb/theme';
import {Battery} from '@atb/assets/svg/mono-icons/vehicles';
import {ScooterTexts} from '@atb/translations/screens/subscreens/MobilityTexts';
import {VehicleStat} from '@atb/mobility/components/VehicleStat';
import {GenericSectionItem, Section} from '@atb/components/sections';
import {formatDecimalNumber} from '@atb/utils/numbers';
import {PricingPlan} from '@atb/mobility/components/PricingPlan';
import {OperatorLogo} from '@atb/mobility/components/OperatorLogo';
import {
  getBenefit,
  getRentalAppUri,
  isBenefitOffered,
  isUserEligibleForBenefit,
} from '@atb/mobility/utils';
import {useSystem} from '@atb/mobility/use-system';
import {VehicleStats} from '@atb/mobility/components/VehicleStats';
import {useVehicle} from '@atb/mobility/use-vehicle';
import {ActivityIndicator, ScrollView, View} from 'react-native';
import {MessageBox} from '@atb/components/message-box';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {OperatorBenefit} from '@atb/mobility/components/OperatorBenefit';
import {CallToActionButton} from '@atb/mobility/components/CallToActionButton';
import {useBenefits} from '@atb/mobility/use-benefits';

type Props = {
  vehicleId: VehicleId;
  close: () => void;
};
export const ScooterSheet = ({vehicleId: id, close}: Props) => {
  const {t, language} = useTranslation();
  const style = useSheetStyle();
  const {vehicle, isLoading, error} = useVehicle(id);
  const {appStoreUri, brandLogoUrl, operatorId, operatorName} = useSystem(
    vehicle,
    vehicle?.system.operator.name,
  );
  const {userBenefits, operatorBenefits} = useBenefits(operatorId);
  const rentalAppUri = getRentalAppUri(vehicle);

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
                    eligibleBenefits={
                      isBenefitOffered('free-unlock', operatorBenefits) &&
                      isUserEligibleForBenefit('free-unlock', userBenefits)
                        ? ['free-unlock']
                        : []
                    }
                  />
                }
              />
              {/* The data model handles multiple benefits per operator,*/}
              {/* but we currently know there is only one, and the UI has to change anyway*/}
              {/* to support an undetermined number of benefits.*/}
              <OperatorBenefit
                benefit={getBenefit('free-unlock', operatorBenefits)}
                isUserEligible={isUserEligibleForBenefit(
                  'free-unlock',
                  userBenefits,
                )}
                style={style.benefit}
              />
            </ScrollView>
            <View style={style.footer}>
              <CallToActionButton
                operatorName={operatorName}
                operatorId={operatorId}
                rentalAppUri={rentalAppUri}
                appStoreUri={appStoreUri}
                userBenefits={userBenefits}
                operatorBenefits={operatorBenefits}
              />
            </View>
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
    benefit: {
      marginBottom: theme.spacings.medium,
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
