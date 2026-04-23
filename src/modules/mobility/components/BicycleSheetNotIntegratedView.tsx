import {Station} from '@atb/api/types/mobility';
import {FormFactor} from '@atb/api/types/generated/mobility-types_v2';
import {Parking} from '@atb/assets/svg/mono-icons/places';
import {BicycleFill} from '@atb/assets/svg/mono-icons/transportation';
import {GenericSectionItem, Section} from '@atb/components/sections';
import {ThemeText} from '@atb/components/text';
import {useAnalyticsContext} from '@atb/modules/analytics';
import {
  PayWithBonusPointsCheckbox,
  findRelevantBonusProduct,
} from '@atb/modules/bonus';
import {useFirestoreConfigurationContext} from '@atb/modules/configuration';
import {StyleSheet} from '@atb/theme';
import {ThemedCityBike} from '@atb/theme/ThemedAssets';
import {useTranslation} from '@atb/translations';
import {BicycleTexts} from '@atb/translations/screens/subscreens/MobilityTexts';
import React, {useState} from 'react';
import {View} from 'react-native';
import {useOperatorBenefit} from '../use-operator-benefit';
import {BrandingImage} from './BrandingImage';
import {MobilityStat} from './MobilityStat';
import {MobilityStats} from './MobilityStats';
import {OperatorActionButton} from './OperatorActionButton';
import {OperatorBenefit} from './OperatorBenefit';
import {OperatorNameAndLogo} from './OperatorNameAndLogo';
import {useIsBonusActiveForUser} from '@atb/modules/bonus';

type Props = {
  onStationReceived?: (station: Station) => void;
  rentalAppUri?: string;
  appStoreUri?: string;
  operatorId?: string;
  operatorName: string;
  brandLogoUrl?: string;
  stationName?: string;
  availableBikes: number;
  numDocksAvailable?: number;
};

export const BikeStationNotIntegratedView = ({
  rentalAppUri,
  appStoreUri,
  operatorId,
  operatorName,
  brandLogoUrl,
  stationName,
  availableBikes,
  numDocksAvailable,
}: Props) => {
  const {t} = useTranslation();
  const styles = useSheetStyle();

  const {operatorBenefit} = useOperatorBenefit(operatorId);
  const isBonusActiveForUser = useIsBonusActiveForUser();
  const {bonusProducts} = useFirestoreConfigurationContext();
  const bonusProduct = findRelevantBonusProduct(
    bonusProducts,
    operatorId,
    FormFactor.Bicycle,
  );
  const {logEvent} = useAnalyticsContext();

  const [payWithBonusPoints, setPayWithBonusPoints] = useState(false);

  return (
    <>
      <View style={styles.container}>
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
              <ThemeText typography="body__s" color="secondary">
                {stationName}
              </ThemeText>
            </View>
          </GenericSectionItem>
          <GenericSectionItem>
            <View style={styles.mobilityStatContainer}>
              <MobilityStats
                first={
                  <MobilityStat
                    svg={BicycleFill}
                    text={`**${availableBikes}** ${t(
                      BicycleTexts.stations.numBikesAvailable(availableBikes),
                    )}`}
                  />
                }
                second={
                  <MobilityStat
                    svg={Parking}
                    text={`**${numDocksAvailable ?? t(BicycleTexts.stations.unknownDocksAvailable)}** ${t(
                      BicycleTexts.stations.numDocksAvailable(
                        numDocksAvailable,
                      ),
                    )}`}
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
        {isBonusActiveForUser && bonusProduct && (
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
            appStoreUri={appStoreUri ?? undefined}
            rentalAppUri={rentalAppUri}
            isBonusPayment={payWithBonusPoints}
            setIsBonusPayment={setPayWithBonusPoints}
            bonusProductId={bonusProduct?.id}
          />
        </View>
      )}
    </>
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
