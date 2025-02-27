import {useTranslation} from '@atb/translations';
import React, {useState} from 'react';
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
import {MessageInfoBox} from '@atb/components/message-info-box';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {useOperatorBenefit} from '@atb/mobility/use-operator-benefit';
import {OperatorBenefit} from '@atb/mobility/components/OperatorBenefit';
import {OperatorActionButton} from '@atb/mobility/components/OperatorActionButton';
import {FormFactor} from '@atb/api/types/generated/mobility-types_v2';
import {ThemeText} from '@atb/components/text';
import {Bicycle} from '@atb/assets/svg/mono-icons/transportation-entur';
import {MobilityStats} from '@atb/mobility/components/MobilityStats';
import {MobilityStat} from '@atb/mobility/components/MobilityStat';
import {Parking} from '@atb/assets/svg/mono-icons/places';
import {WalkingDistance} from '@atb/components/walking-distance';
import {BrandingImage} from '@atb/mobility/components/BrandingImage';
import {ThemedCityBike} from '@atb/theme/ThemedAssets';
import {BikeStationFragment} from '@atb/api/types/generated/fragments/stations';
import {useDoOnceOnItemReceived} from '../use-do-once-on-item-received';
import {useFirestoreConfigurationContext} from '@atb/configuration';
import {useFeatureTogglesContext} from '@atb/modules/feature-toggles';
import {PayWithBonusPointsCheckbox} from '@atb/mobility/components/PayWithBonusPointsCheckbox';
import {findRelevantBonusProduct} from '../utils';

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

  const [useBonusPoints, setUseBonusPoints] = useState(false);
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
                          svg={Bicycle}
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
                      fallback={<ThemedCityBike />}
                    />
                  </View>
                </GenericSectionItem>
              </Section>
              {isBonusProgramEnabled && bonusProduct && (
                <PayWithBonusPointsCheckbox
                  bonusProduct={bonusProduct}
                  isChecked={useBonusPoints}
                  onPress={() => setUseBonusPoints(!useBonusPoints)}
                  style={styles.useBonusPointsSection}
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
  const {bottom} = useSafeAreaInsets();
  return {
    activityIndicator: {
      marginBottom: Math.max(bottom, theme.spacing.medium),
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
      marginBottom: Math.max(bottom, theme.spacing.medium),
      marginHorizontal: theme.spacing.medium,
    },
    mobilityStatContainer: {
      flexDirection: 'row',
      alignItems: 'center',
    },
    operatorNameAndLogo: {
      flexDirection: 'row',
    },
    useBonusPointsSection: {
      marginTop: theme.spacing.medium,
    },
  };
});
