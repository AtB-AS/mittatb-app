import {
  VehicleExtendedFragment,
  VehicleId,
} from '@atb/api/types/generated/fragments/vehicles';
import React from 'react';
import {BottomSheetContainer} from '@atb/components/bottom-sheet';
import {useTranslation} from '@atb/translations';
import {StyleSheet} from '@atb/theme';
import {
  MobilityTexts,
  ScooterTexts,
} from '@atb/translations/screens/subscreens/MobilityTexts';
import {useVehicle} from '@atb/mobility/use-vehicle';
import {ActivityIndicator, ScrollView, View} from 'react-native';
import {MessageInfoBox} from '@atb/components/message-info-box';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {Button} from '@atb/components/button';
import {ArrowRight} from '@atb/assets/svg/mono-icons/navigation';
import {useOperatorBenefit} from '@atb/mobility/use-operator-benefit';
import {OperatorBenefit} from '@atb/mobility/components/OperatorBenefit';
import {OperatorActionButton} from '@atb/mobility/components/OperatorActionButton';
import {FormFactor} from '@atb/api/types/generated/mobility-types_v2';
import {useDoOnceOnItemReceived} from '../use-do-once-on-item-received';
import {useFeatureTogglesContext} from '@atb/feature-toggles';
import {VehicleCard} from './VehicleCard';

type Props = {
  vehicleId: VehicleId;
  onClose: () => void;
  onReportParkingViolation: () => void;
  onVehicleReceived?: (vehicle: VehicleExtendedFragment) => void;
};

export const ScooterSheet = ({
  vehicleId: id,
  onClose,
  onReportParkingViolation,
  onVehicleReceived,
}: Props) => {
  const {t} = useTranslation();
  const styles = useSheetStyle();
  const {
    vehicle,
    isLoading,
    isError,
    operatorId,
    operatorName,
    rentalAppUri,
    appStoreUri,
  } = useVehicle(id);

  const {operatorBenefit} = useOperatorBenefit(operatorId);

  useDoOnceOnItemReceived(onVehicleReceived, vehicle);

  const {isParkingViolationsReportingEnabled} = useFeatureTogglesContext();

  return (
    <BottomSheetContainer
      title={t(MobilityTexts.formFactor(FormFactor.Scooter))}
      maxHeightValue={0.5}
      onClose={onClose}
    >
      <>
        {isLoading && (
          <View style={styles.activityIndicator}>
            <ActivityIndicator size="large" />
          </View>
        )}
        {!isLoading && !isError && vehicle && (
          <>
            <ScrollView style={styles.container}>
              {operatorBenefit && (
                <OperatorBenefit
                  benefit={operatorBenefit}
                  formFactor={FormFactor.Scooter}
                  style={styles.operatorBenefit}
                />
              )}
              <VehicleCard vehicleId={id} />
            </ScrollView>
            <View style={styles.footer}>
              {rentalAppUri && (
                <OperatorActionButton
                  operatorId={operatorId}
                  operatorName={operatorName}
                  benefit={operatorBenefit}
                  appStoreUri={appStoreUri}
                  rentalAppUri={rentalAppUri}
                />
              )}
              {isParkingViolationsReportingEnabled && (
                <Button
                  expanded={true}
                  style={styles.parkingViolationsButton}
                  text={t(MobilityTexts.reportParkingViolation)}
                  mode="secondary"
                  onPress={onReportParkingViolation}
                  rightIcon={{svg: ArrowRight}}
                />
              )}
            </View>
          </>
        )}
        {!isLoading && (isError || !vehicle) && (
          <View style={styles.footer}>
            <MessageInfoBox
              type="error"
              message={t(ScooterTexts.loadingFailed)}
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
      paddingHorizontal: theme.spacing.medium,
      marginBottom: theme.spacing.medium,
    },
    footer: {
      marginBottom: Math.max(bottom, theme.spacing.medium),
      marginHorizontal: theme.spacing.medium,
    },
    parkingViolationsButton: {
      marginTop: theme.spacing.medium,
    },
    operatorNameAndLogo: {
      flexDirection: 'row',
    },
  };
});
