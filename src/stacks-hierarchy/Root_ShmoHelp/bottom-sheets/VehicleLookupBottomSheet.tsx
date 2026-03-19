import {ViolationsReportingProvider} from '@atb/api/types/mobility';
import {Button} from '@atb/components/button';
import {ThemeText} from '@atb/components/text';
import {StyleSheet} from '@atb/theme';
import {useTranslation} from '@atb/translations';
import {ParkingViolationTexts} from '@atb/translations/screens/ParkingViolations';
import {View} from 'react-native';
import {ProviderLogo} from '../components/ProviderLogo';
import {
  BottomSheetHeaderType,
  BottomSheetModal,
} from '@atb/components/bottom-sheet';
import {giveFocus} from '@atb/utils/use-focus-on-load';
import {BottomSheetModal as GorhomBottomSheetModal} from '@gorhom/bottom-sheet';

type Props = {
  provider: ViolationsReportingProvider;
  vehicleId: string | undefined;
  onReportSubmit: (providerId: number) => void;
  onClose: () => void;
  onCloseFocusRef: React.RefObject<View | null>;
  bottomSheetModalRef: React.RefObject<GorhomBottomSheetModal | null>;
};

export const VehicleLookupConfirmationBottomSheet = ({
  provider,
  vehicleId,
  onReportSubmit,
  onClose,
  onCloseFocusRef,
  bottomSheetModalRef,
}: Props) => {
  const {t} = useTranslation();
  const styles = useStyles();

  return (
    <BottomSheetModal
      bottomSheetModalRef={bottomSheetModalRef}
      heading={t(ParkingViolationTexts.vehicleLookup.title)}
      bottomSheetHeaderType={BottomSheetHeaderType.Close}
      closeCallback={() => {
        giveFocus(onCloseFocusRef);
        onClose();
      }}
    >
      <View style={styles.content}>
        <ProviderLogo provider={provider} />
        <ThemeText>{vehicleId}</ThemeText>
      </View>
      <View style={styles.footer}>
        <Button
          expanded={true}
          text="Send inn rapport"
          onPress={() => onReportSubmit(Number(provider.id))}
        />
      </View>
    </BottomSheetModal>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => {
  return {
    content: {
      flexDirection: 'row',
      alignItems: 'center',
      justifyContent: 'center',
      gap: theme.spacing.medium,
      padding: theme.spacing.medium,
      margin: theme.spacing.medium,
    },
    footer: {
      marginHorizontal: theme.spacing.medium,
      marginTop: theme.spacing.medium,
    },
  };
});
