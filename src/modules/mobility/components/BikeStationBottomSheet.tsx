import {useTranslation} from '@atb/translations';
import React, {useState} from 'react';
import {BottomSheetContainer} from '@atb/components/bottom-sheet';
import {GenericSectionItem, Section} from '@atb/components/sections';
import {OperatorNameAndLogo} from './OperatorNameAndLogo';
import {
  BicycleTexts,
  MobilityTexts,
} from '@atb/translations/screens/subscreens/MobilityTexts';
import {StyleSheet} from '@atb/theme';
import {ActivityIndicator, ScrollView, View} from 'react-native';
import {useBikeStation} from '../use-bike-station';
import {MessageInfoBox} from '@atb/components/message-info-box';
import {useOperatorBenefit} from '../use-operator-benefit';
import {OperatorBenefit} from './OperatorBenefit';
import {OperatorActionButton} from './OperatorActionButton';
import {FormFactor} from '@atb/api/types/generated/mobility-types_v2';
import {ThemeText} from '@atb/components/text';
import {BicycleFill} from '@atb/assets/svg/mono-icons/transportation';
import {MobilityStats} from './MobilityStats';
import {MobilityStat} from './MobilityStat';
import {Parking} from '@atb/assets/svg/mono-icons/places';
import {WalkingDistance} from '@atb/components/walking-distance';
import {BrandingImage} from './BrandingImage';
import {ThemedCityBike} from '@atb/theme/ThemedAssets';
import {BikeStationFragment} from '@atb/api/types/generated/fragments/stations';
import {useDoOnceOnItemReceived} from '../use-do-once-on-item-received';
import {useFirestoreConfigurationContext} from '@atb/modules/configuration';
import {useFeatureTogglesContext} from '@atb/modules/feature-toggles';
import {
  PayWithBonusPointsCheckbox,
  findRelevantBonusProduct,
} from '@atb/modules/bonus';

type Props = {
  stationId: string;
  distance: number | undefined;
  onClose: () => void;
  onStationReceived?: (station: BikeStationFragment) => void;
};

export const BikeStationBottomSheet = ({
  stationId,
  distance,
  onClose,
  onStationReceived,
}: Props) => {
  const {t} = useTranslation();
  const styles = useSheetStyle();
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
  const {isBonusProgramEnabled} = useFeatureTogglesContext();
  const {bonusProducts} = useFirestoreConfigurationContext();
  const bonusProduct = findRelevantBonusProduct(
    bonusProducts,
    operatorId,
    FormFactor.Bicycle,
  );

  const [payWithBonusPoints, setPayWithBonusPoints] = useState(false);
  useDoOnceOnItemReceived(onStationReceived, station);

  return (
    <BottomSheetContainer
      maxHeightValue={0.6}
      title={t(MobilityTexts.formFactor(FormFactor.Bicycle))}
      onClose={onClose}
    >
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
                    <ThemeText typography="body__secondary" color="secondary">
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
                          svg={BicycleFill}
                          primaryStat={availableBikes}
                          secondaryStat={t(
                            BicycleTexts.stations.numBikesAvailable(
                              availableBikes,
                            ),
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
                            BicycleTexts.stations.numDocksAvailable(
                              station.numDocksAvailable,
                            ),
                          )}
                        />
                      }
                    />
                    <BrandingImage
                      logoUrl={brandLogoUrl}
                      fallback={<ThemedCityBike height={48} width={70} />}
                    />
                  </View>
                </GenericSectionItem>
              </Section>
              {isBonusProgramEnabled && bonusProduct && (
                <PayWithBonusPointsCheckbox
                  bonusProduct={bonusProduct}
                  operatorName={operatorName}
                  isChecked={payWithBonusPoints}
                  onPress={() =>
                    setPayWithBonusPoints(
                      (payWithBonusPoints) => !payWithBonusPoints,
                    )
                  }
                  style={styles.payWithBonusPointsSection}
                />
              )}
            </ScrollView>
            {rentalAppUri && (
              <View style={styles.footer}>
                <OperatorActionButton
                  operatorId={operatorId}
                  operatorName={operatorName}
                  benefit={operatorBenefit}
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
              message={t(BicycleTexts.loadingFailed)}
            />
          </View>
        )}
      </>
    </BottomSheetContainer>
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
    container: {
      marginHorizontal: theme.spacing.medium,
      marginBottom: theme.spacing.medium,
    },
    stationName: {
      flex: 1,
      alignItems: 'center',
    },
    stationText: {
      display: 'flex',
      flexDirection: 'row',
      marginTop: theme.spacing.small,
    },
    footer: {
      marginBottom: theme.spacing.medium,
      marginHorizontal: theme.spacing.medium,
    },
    mobilityStatContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    operatorNameAndLogo: {
      flexDirection: 'row',
    },
    payWithBonusPointsSection: {
      marginTop: theme.spacing.medium,
    },
  };
});
