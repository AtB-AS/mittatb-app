import {ViolationsReportingProvider} from '@atb/api/types/mobility';
import {BottomSheetContainer} from '@atb/components/bottom-sheet';
import {Button} from '@atb/components/button';
import {ThemeText} from '@atb/components/text';
import {StyleSheet} from '@atb/theme';
import {useTranslation} from '@atb/translations';
import {ParkingViolationTexts} from '@atb/translations/screens/ParkingViolations';
import {View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {ProviderLogo} from '../components/ProviderLogo';

type Props = {
  provider: ViolationsReportingProvider;
  vehicleId: string | undefined;
  onReportSubmit: (providerId: number) => void;
  onClose: () => void;
};

export const VehicleLookupConfirmationBottomSheet = ({
  provider,
  vehicleId,
  onReportSubmit,
  onClose,
}: Props) => {
  const {t} = useTranslation();
  const styles = useStyles();

  return (
    <BottomSheetContainer
      title={t(ParkingViolationTexts.vehicleLookup.title)}
      onClose={onClose}
    >
      <View style={styles.content}>
        <ProviderLogo provider={provider} />
        <ThemeText>{vehicleId}</ThemeText>
      </View>
      <View style={styles.footer}>
        <Button
          expand={true}
          text="Send inn rapport"
          onPress={() => onReportSubmit(Number(provider.id))}
        />
      </View>
    </BottomSheetContainer>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => {
  const {bottom} = useSafeAreaInsets();
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
      margin: theme.spacing.medium,
      marginBottom: Math.max(bottom, theme.spacing.medium),
    },
  };
});
