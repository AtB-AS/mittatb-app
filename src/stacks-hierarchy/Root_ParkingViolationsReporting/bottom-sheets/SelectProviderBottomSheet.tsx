import {ViolationsReportingProvider} from '@atb/api/types/mobility';
import {BottomSheetContainer} from '@atb/components/bottom-sheet';
import {Button} from '@atb/components/button';
import {ThemeText} from '@atb/components/text';
import {StyleSheet, useThemeContext} from '@atb/theme';
import {useTranslation} from '@atb/translations';
import {ParkingViolationTexts} from '@atb/translations/screens/ParkingViolations';
import {useState} from 'react';
import {ScrollView, View} from 'react-native';
import {useSafeAreaInsets} from 'react-native-safe-area-context';
import {ProviderLogo} from '../components/ProviderLogo';
import {SelectGroup} from '../components/SelectGroup';

type Props = {
  providers: ViolationsReportingProvider[];
  onClose: () => void;
  onSelect: (provider: ViolationsReportingProvider) => void;
  qrScanFailed: boolean | undefined;
};

export const SelectProviderBottomSheet = ({
  providers,
  onClose,
  onSelect,
  qrScanFailed,
}: Props) => {
  const {t} = useTranslation();
  const {theme} = useThemeContext();
  const styles = useStyles();
  const [selectedProvider, setSelectedProvider] =
    useState<ViolationsReportingProvider>();

  return (
    <BottomSheetContainer
      title={t(ParkingViolationTexts.selectProvider.title)}
      onClose={onClose}
    >
      <>
        <ThemeText style={styles.content}>
          {qrScanFailed
            ? t(ParkingViolationTexts.selectProvider.qrFailedDescription)
            : t(ParkingViolationTexts.selectProvider.description)}
        </ThemeText>
        <ScrollView style={styles.providerList}>
          <SelectGroup
            mode="radio"
            style={styles.content}
            items={providers}
            onSelect={setSelectedProvider}
            keyExtractor={(provider) => 'provider' + provider.id}
            generateAccessibilityLabel={(provider) => provider.name}
            renderItem={(provider, isSeleted) => (
              <>
                <ProviderLogo
                  style={[
                    styles.providerLogo,
                    {
                      borderColor: isSeleted
                        ? theme.color.interactive[0].default.background
                        : theme.color.background.neutral[0].background,
                    },
                  ]}
                  provider={provider}
                />
                <ThemeText>{provider.name}</ThemeText>
              </>
            )}
          />
        </ScrollView>
        <View style={[styles.content, styles.footer]}>
          <Button
            text={t(ParkingViolationTexts.selectProvider.confirm)}
            onPress={() =>
              selectedProvider ? onSelect(selectedProvider) : undefined
            }
            disabled={!selectedProvider}
          />
        </View>
      </>
    </BottomSheetContainer>
  );
};

const useStyles = StyleSheet.createThemeHook((theme) => {
  const {bottom} = useSafeAreaInsets();
  return {
    content: {
      marginHorizontal: theme.spacing.medium,
    },
    providerList: {
      marginTop: theme.spacing.medium,
      flexGrow: 1,
    },
    providerLogo: {
      borderWidth: 1,
      marginRight: theme.spacing.medium,
    },
    footer: {
      marginTop: theme.spacing.medium,
      marginBottom: Math.max(bottom, theme.spacing.medium),
    },
  };
});
