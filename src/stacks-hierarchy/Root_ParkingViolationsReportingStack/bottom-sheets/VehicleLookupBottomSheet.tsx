import {ViolationsReportingProvider} from '@atb/api/types/mobility';
import {BottomSheetContainer} from '@atb/components/bottom-sheet';
import {Button} from '@atb/components/button';
import {ScreenHeaderWithoutNavigation} from '@atb/components/screen-header';
import {ThemeText} from '@atb/components/text';
import {StyleSheet} from '@atb/theme';
import {ScreenHeaderTexts, useTranslation} from '@atb/translations';
import {ParkingViolationTexts} from '@atb/translations/screens/ParkingViolations';
import {View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {ProviderLogo} from '@atb/stacks-hierarchy/Root_ParkingViolationsReportingStack/components/ProviderLogo';

type Props = {
  provider: ViolationsReportingProvider;
  vehicleId: string | undefined;
  onReportSubmit: (providerId: number) => void;
  close: () => void;
};

export const VehicleLookupConfirmationBottomSheet = ({
  provider,
  vehicleId,
  onReportSubmit,
  close,
}: Props) => {
  const {t} = useTranslation();
  const styles = useStyles();

  return (
    <BottomSheetContainer>
      <ScreenHeaderWithoutNavigation
        leftButton={{
          type: 'close',
          onPress: close,
          text: t(ScreenHeaderTexts.headerButton.close.text),
        }}
        color={'background_1'}
        setFocusOnLoad={false}
        title={t(ParkingViolationTexts.vehicleLookup.title)}
      />
      <View style={styles.content}>
        <ProviderLogo provider={provider} />
        <ThemeText>{vehicleId}</ThemeText>
      </View>
      <View style={styles.footer}>
        <Button
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
      gap: theme.spacings.medium,
      padding: theme.spacings.medium,
      margin: theme.spacings.medium,
    },
    footer: {
      margin: theme.spacings.medium,
      marginBottom: Math.max(bottom, theme.spacings.medium),
    },
  };
});
