import {dictionary, useTranslation} from '@atb/translations';
import React, {useState} from 'react';
import {GenericSectionItem, Section} from '@atb/components/sections';
import {OperatorNameAndLogo} from './OperatorNameAndLogo';
import {
  CarSharingTexts,
  MobilityTexts,
} from '@atb/translations/screens/subscreens/MobilityTexts';
import {StyleSheet} from '@atb/theme';
import {ActivityIndicator, View} from 'react-native';
import {MessageInfoBox} from '@atb/components/message-info-box';
import {useCarSharingStation} from '../use-car-sharing-station';
import {ThemeText} from '@atb/components/text';
import {
  CarAvailabilityFragment,
  CarStationFragment,
} from '@atb/api/types/generated/fragments/stations';
import {useOperatorBenefit} from '../use-operator-benefit';
import {OperatorActionButton} from './OperatorActionButton';
import {OperatorBenefit} from './OperatorBenefit';
import {FormFactor} from '@atb/api/types/generated/mobility-types_v2';
import {CarFill} from '@atb/assets/svg/mono-icons/transportation';
import {CarPreviews} from './CarPreviews';
import {WalkingDistance} from '@atb/components/walking-distance';
import {MobilityStat} from './MobilityStat';
import {useDoOnceOnItemReceived} from '../use-do-once-on-item-received';
import {useFeatureTogglesContext} from '@atb/modules/feature-toggles';
import {useFirestoreConfigurationContext} from '@atb/modules/configuration';
import {
  findRelevantBonusProduct,
  PayWithBonusPointsCheckbox,
} from '@atb/modules/bonus';
import {Close} from '@atb/assets/svg/mono-icons/actions';
import {MapBottomSheet} from '@atb/components/bottom-sheet-v2';
import {useAnalyticsContext} from '@atb/modules/analytics';

type Props = {
  stationId: string;
  distance: number | undefined;
  onClose: () => void;
  onStationReceived?: (station: CarStationFragment) => void;
  locationArrowOnPress: () => void;
  navigateToScanQrCode: () => void;
};

export const CarSharingStationBottomSheet = ({
  stationId,
  distance,
  onClose,
  onStationReceived,
  locationArrowOnPress,
  navigateToScanQrCode,
}: Props) => {
  const {t} = useTranslation();
  const styles = useSheetStyle();

  const {
    station,
    isLoading,
    isError,
    operatorId,
    operatorName,
    brandLogoUrl,
    appStoreUri,
    rentalAppUri,
    stationName,
  } = useCarSharingStation(stationId);
  const {operatorBenefit} = useOperatorBenefit(operatorId);

  const {isBonusProgramEnabled} = useFeatureTogglesContext();
  const {bonusProducts} = useFirestoreConfigurationContext();
  const bonusProduct = findRelevantBonusProduct(
    bonusProducts,
    operatorId,
    FormFactor.Car,
  );

  const {logEvent} = useAnalyticsContext();

  const [payWithBonusPoints, setPayWithBonusPoints] = useState(false);
  useDoOnceOnItemReceived(onStationReceived, station);

  return (
    <MapBottomSheet
      canMinimize={true}
      enablePanDownToClose={false}
      closeCallback={onClose}
      closeOnBackdropPress={false}
      allowBackgroundTouch={true}
      enableDynamicSizing={true}
      heading={operatorName}
      subText={t(MobilityTexts.formFactor(FormFactor.Car))}
      rightIconText={t(dictionary.appNavigation.close.text)}
      rightIcon={Close}
      logoUrl={brandLogoUrl}
      locationArrowOnPress={locationArrowOnPress}
      navigateToScanQrCode={navigateToScanQrCode}
    >
      <>
        {isLoading && (
          <View style={styles.activityIndicator}>
            <ActivityIndicator size="large" />
          </View>
        )}
        {!isLoading && !isError && station && (
          <>
            <View style={styles.container}>
              {operatorBenefit && (
                <OperatorBenefit
                  benefit={operatorBenefit}
                  formFactor={FormFactor.Car}
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
                    <ThemeText typography="body__s" color="secondary">
                      {stationName}
                    </ThemeText>
                    <WalkingDistance distance={distance} />
                  </View>
                </GenericSectionItem>
                <GenericSectionItem>
                  <View style={styles.carSection}>
                    <MobilityStat
                      svg={CarFill}
                      text={`**${t(
                        CarSharingTexts.stations.carsAvailable(
                          totalAvailableCars(station.vehicleTypesAvailable),
                          station.capacity,
                        ),
                      )}** ${t(CarSharingTexts.stations.carsAvailableLabel)}`}
                    />
                    {station.vehicleTypesAvailable && (
                      <CarPreviews
                        stationCapacity={station.capacity}
                        vehicleTypesAvailable={station.vehicleTypesAvailable}
                      />
                    )}
                  </View>
                </GenericSectionItem>
              </Section>
              {isBonusProgramEnabled && bonusProduct && (
                <PayWithBonusPointsCheckbox
                  bonusProduct={bonusProduct}
                  operatorName={operatorName}
                  isChecked={payWithBonusPoints}
                  onPress={() =>
                    setPayWithBonusPoints((payWithBonusPoints) => {
                      const newState = !payWithBonusPoints;
                      logEvent('Bonus', 'bonus points checkbox toggled', {
                        bonusProductId: bonusProduct.id,
                        newState: newState,
                      });
                      return newState;
                    })
                  }
                  style={styles.payWithBonusPointsSection}
                />
              )}
            </View>
            {rentalAppUri && (
              <View style={styles.footer}>
                <OperatorActionButton
                  operatorId={operatorId}
                  operatorName={operatorName}
                  appStoreUri={appStoreUri}
                  rentalAppUri={rentalAppUri}
                  isBonusPayment={payWithBonusPoints}
                  setIsBonusPayment={setPayWithBonusPoints}
                  bonusProductId={bonusProduct?.id}
                />
              </View>
            )}
          </>
        )}
        {!isLoading && (isError || !station) && (
          <View style={styles.footer}>
            <MessageInfoBox
              type="error"
              message={t(CarSharingTexts.loadingFailed)}
            />
          </View>
        )}
      </>
    </MapBottomSheet>
  );
};

const useSheetStyle = StyleSheet.createThemeHook((theme) => {
  return {
    activityIndicator: {
      marginBottom: theme.spacing.medium,
    },
    operatorBenefit: {
      marginBottom: theme.spacing.medium,
    },
    carSection: {
      display: 'flex',
      flexDirection: 'row',
      flex: 1,
      alignItems: 'center',
      justifyContent: 'space-between',
    },
    container: {
      marginHorizontal: theme.spacing.medium,
      marginBottom: theme.spacing.medium,
    },
    footer: {
      marginBottom: theme.spacing.medium,
      marginHorizontal: theme.spacing.medium,
    },
    icon: {
      marginEnd: theme.spacing.small,
    },
    operatorNameAndLogo: {
      flexDirection: 'row',
    },
    stationText: {
      display: 'flex',
      flexDirection: 'row',
      marginTop: theme.spacing.small,
    },
    payWithBonusPointsSection: {
      marginTop: theme.spacing.medium,
    },
  };
});

const totalAvailableCars = (
  vehicleTypesAvailable: CarAvailabilityFragment[] | undefined,
) =>
  vehicleTypesAvailable
    ?.map((v) => v.count)
    .reduce((sum, count) => sum + count, 0) ?? 0;
